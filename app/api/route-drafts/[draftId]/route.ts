import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  heroBannerImageAssetSchema,
  missionMilestoneSchema,
  routeDraftMilestoneImageAssetSchema,
  routePointSchema,
} from "@/lib/routeDraftSchemas";
import { adminDb } from "@/lib/firebaseAdmin";
import { deleteCloudinaryImageAsset } from "@/lib/deleteCloudinaryImageAsset";
import type { RouteDraftMilestoneImageAsset } from "@/types/routeTypes";

const routeDraftPatchSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  heroBannerImageAsset: heroBannerImageAssetSchema.optional(),
  startDate: z.string().optional(),
  goalDistanceMeters: z.number().optional(),
  snapToRoads: z.boolean().optional(),
  routePoints: z.array(routePointSchema).optional(),
  snappedRoutePoints: z.array(routePointSchema).optional(),
  routeLockedAt: z.iso.datetime().optional(),
  milestonesLockedAt: z.iso.datetime().optional(),
  milestones: z.array(missionMilestoneSchema).optional(),
  milestoneImageAssets: z.array(routeDraftMilestoneImageAssetSchema).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ draftId: string }> },
) {
  const { isAuthenticated, sessionClaims, userId } = await auth();

  if (!isAuthenticated)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

  if (role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { draftId } = await params;
  const parseResult = routeDraftPatchSchema.safeParse(await request.json());

  if (!parseResult.success)
    return NextResponse.json({ error: "Invalid route draft" }, { status: 400 });

  const draftRef = adminDb.collection("routeDrafts").doc(draftId);
  const draftSnapshot = await draftRef.get();

  if (!draftSnapshot.exists)
    return NextResponse.json(
      { error: "Route draft not found" },
      { status: 404 },
    );

  const draft = draftSnapshot.data();

  if (draft?.createdByAdminId !== userId) {
    return NextResponse.json(
      { error: "Cannot edit another admin's draft" },
      { status: 403 },
    );
  }
  const isChangingMilestoneLockTime =
    Boolean(draft?.milestonesLockedAt) &&
    parseResult.data.milestonesLockedAt !== undefined &&
    parseResult.data.milestonesLockedAt !== draft?.milestonesLockedAt;

  if (isChangingMilestoneLockTime)
    return NextResponse.json(
      { error: "Milestone lock time cannot be changed" },
      { status: 409 },
    );
  const lockedRouteFields = [
    "goalDistanceMeters",
    "snapToRoads",
    "routePoints",
    "snappedRoutePoints",
  ] as const;

  const isEditingLockedRoute =
    Boolean(draft?.routeLockedAt) &&
    lockedRouteFields.some((field) => parseResult.data[field] !== undefined);

  if (isEditingLockedRoute)
    return NextResponse.json({ error: "Route is locked" }, { status: 409 });

  const currentImageAssets = Array.isArray(draft?.milestoneImageAssets)
    ? (draft.milestoneImageAssets as RouteDraftMilestoneImageAsset[])
    : [];
  const isChangingLockedMilestoneCount =
    Boolean(draft?.milestonesLockedAt) &&
    parseResult.data.milestones !== undefined &&
    parseResult.data.milestones.length !==
      (Array.isArray(draft?.milestones) ? draft.milestones.length : 0);

  if (isChangingLockedMilestoneCount)
    return NextResponse.json(
      { error: "Milestone positions are locked" },
      { status: 409 },
    );

  const isChangingLockedMilestoneOrder =
    Boolean(draft?.milestonesLockedAt) &&
    parseResult.data.milestones?.some(
      (milestone, index) => milestone.id !== draft?.milestones?.[index]?.id,
    );

  if (isChangingLockedMilestoneOrder)
    return NextResponse.json(
      { error: "Milestone order is locked" },
      { status: 409 },
    );

  const isChangingLockedMilestoneDistance =
    Boolean(draft?.milestonesLockedAt) &&
    parseResult.data.milestones?.some(
      (milestone, index) =>
        milestone.distanceMeters !== draft?.milestones?.[index]?.distanceMeters,
    );

  if (isChangingLockedMilestoneDistance)
    return NextResponse.json(
      { error: "Milestone positions are locked" },
      { status: 409 },
    );

  const isChangingLockedMilestoneCoordinates =
    Boolean(draft?.milestonesLockedAt) &&
    parseResult.data.milestones?.some(
      (milestone, index) =>
        milestone.position.latitude !== draft?.milestones?.[index]?.latitude ||
        milestone.position.longitude !== draft?.milestones?.[index]?.longitude,
    );

  if (isChangingLockedMilestoneCoordinates)
    return NextResponse.json(
      { error: "Milestone positions are locked" },
      { status: 409 },
    );

  const isLockingMilestonesBeforeRoute =
    parseResult.data.milestonesLockedAt !== undefined && !draft?.routeLockedAt;

  if (isLockingMilestonesBeforeRoute)
    return NextResponse.json(
      { error: "Route must be locked before milestones" },
      { status: 409 },
    );

  const hasUnknownMilestoneImageAsset =
    Boolean(draft?.milestonesLockedAt) &&
    parseResult.data.milestoneImageAssets?.some(
      (asset) =>
        !draft?.milestones?.some(
          (milestone: { id?: string }) => milestone.id === asset.milestoneId,
        ),
    );

  if (hasUnknownMilestoneImageAsset)
    return NextResponse.json(
      { error: "Milestone image does not match an existing milestone" },
      { status: 409 },
    );
  const nextImageAssets = parseResult.data.milestoneImageAssets;
  const oldImagePublicIds: string[] = [];

  const currentHeroBannerResult = heroBannerImageAssetSchema.safeParse(
    draft?.heroBannerImageAsset,
  );
  const nextHeroBannerAsset = parseResult.data.heroBannerImageAsset;

  if (
    currentHeroBannerResult.success &&
    nextHeroBannerAsset &&
    currentHeroBannerResult.data.cloudinaryPublicId !==
      nextHeroBannerAsset.cloudinaryPublicId
  ) {
    oldImagePublicIds.push(currentHeroBannerResult.data.cloudinaryPublicId);
  }

  if (nextImageAssets) {
    for (const currentAsset of currentImageAssets) {
      const nextAsset = nextImageAssets.find(
        (asset) => asset.milestoneId === currentAsset.milestoneId,
      );

      const wasRemovedOrReplaced =
        !nextAsset ||
        nextAsset.cloudinaryPublicId !== currentAsset.cloudinaryPublicId;

      if (wasRemovedOrReplaced) {
        oldImagePublicIds.push(currentAsset.cloudinaryPublicId);
      }
    }
  }

  await draftRef.update({
    ...parseResult.data,
    updatedAt: new Date().toISOString(),
  });

  for (const publicId of oldImagePublicIds) {
    try {
      await deleteCloudinaryImageAsset(publicId);
    } catch (error) {
      console.error(`Failed to delete old milestone image ${publicId}`, error);
    }
  }

  return NextResponse.json({ id: draftId });
}
