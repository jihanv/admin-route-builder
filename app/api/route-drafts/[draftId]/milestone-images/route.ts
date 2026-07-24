import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { uploadCloudinaryImageAsset } from "@/lib/uploadCloudinaryImageAsset";
import { adminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ draftId: string }> },
) {
  const { draftId } = await params;
  const { sessionClaims, userId } = await auth();
  const adminRole =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

  if (adminRole !== "admin") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const draftSnapshot = await adminDb
    .collection("routeDrafts")
    .doc(draftId)
    .get();

  if (
    !draftSnapshot.exists ||
    draftSnapshot.data()?.createdByAdminId !== userId
  ) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  }

  if (!draftSnapshot.data()?.milestonesLockedAt) {
    return NextResponse.json(
      { error: "Milestone positions are not confirmed" },
      { status: 409 },
    );
  }

  const formData = await request.formData();
  const milestoneId = formData.get("milestoneId");
  const imageFile = formData.get("imageFile");
  const milestones = draftSnapshot.data()?.milestones;

  if (
    typeof milestoneId !== "string" ||
    !Array.isArray(milestones) ||
    !milestones.some((milestone) => milestone?.id === milestoneId)
  ) {
    return NextResponse.json({ error: "Milestone not found" }, { status: 400 });
  }

  if (!(imageFile instanceof File)) {
    return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  }

  const allowedImageTypes = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedImageTypes.includes(imageFile.type)) {
    return NextResponse.json(
      { error: "File must be a PNG, JPG, or WebP image" },
      { status: 400 },
    );
  }

  const maxFileSizeBytes = 5 * 1024 * 1024;

  if (imageFile.size > maxFileSizeBytes) {
    return NextResponse.json(
      { error: "Image must be smaller than 5 MB" },
      { status: 400 },
    );
  }

  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await uploadCloudinaryImageAsset({
    buffer,
    folder: `rei-mission-drafts/${draftId}/milestones`,
    tags: [`rei-route-draft-${draftId}`],
  });

  return NextResponse.json({
    ok: true,
    imageUrl: uploadResult.imageUrl,
    publicId: uploadResult.cloudinaryPublicId,
  });
}
