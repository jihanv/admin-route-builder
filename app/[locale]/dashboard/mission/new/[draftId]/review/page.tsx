import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ReviewMissionPage({
  params,
}: {
  params: Promise<{ draftId: string }>;
}) {
  const { draftId } = await params;
  const { sessionClaims, userId } = await auth();
  const adminRole =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

  if (adminRole !== "admin") {
    return <div>Access denied</div>;
  }

  const draftSnapshot = await adminDb
    .collection("routeDrafts")
    .doc(draftId)
    .get();

  if (!draftSnapshot.exists) {
    return <div>Mission draft does not exist.</div>;
  }

  const draft = draftSnapshot.data();

  if (draft?.createdByAdminId !== userId) {
    return <div>Only the creator can review this mission draft.</div>;
  }
  const milestones = Array.isArray(draft?.milestones) ? draft.milestones : [];

  if (milestones.length === 0) {
    return <div>Add milestone positions before reviewing this mission.</div>;
  }

  const hasEmptyMilestoneTitle = milestones.some(
    (milestone) => !String(milestone.title ?? "").trim(),
  );

  if (hasEmptyMilestoneTitle) {
    return <div>All milestone titles must be filled before review.</div>;
  }
  return (
    <section className="space-y-6 p-8">
      <MissionBuilderSteps currentStepId="review-publish" />
      <h1 className="text-2xl font-semibold text-primary">Review Mission</h1>
      <p className="text-base text-muted-foreground">
        Review the mission draft before creating the final mission.
      </p>
      <div className="rounded-lg border bg-card p-4">
        <h2 className="font-semibold">Mission details</h2>
        <div className="mt-3 space-y-2 text-sm">
          <p>
            <span className="font-medium">Title:</span>{" "}
            {String(draft?.title ?? "Untitled mission")}
          </p>
          <p className="text-muted-foreground">
            {String(draft?.description ?? "No description.")}
          </p>
        </div>
      </div>

      <p>
        <span className="font-medium">Start date:</span>{" "}
        {String(draft?.startDate ?? "Not set")}
      </p>
      <p>
        <span className="font-medium">End date:</span>{" "}
        {String(draft?.endDate ?? "Not set")}
      </p>
      <p>
        <span className="font-medium">Goal distance:</span>{" "}
        {draft?.goalDistanceMeters
          ? `${Number(draft.goalDistanceMeters).toLocaleString()} meters`
          : "Not set"}
      </p>
      <Button asChild variant="outline" size="sm">
        <Link href={`/dashboard/mission/new/${draftId}/details`}>
          Edit details
        </Link>
      </Button>

      <div className="rounded-lg border bg-card p-4">
        <h2 className="font-semibold">Route summary</h2>
        <div className="mt-3 space-y-2 text-sm">
          <p>
            <span className="font-medium">Route points:</span>{" "}
            {Array.isArray(draft?.routePoints) ? draft.routePoints.length : 0}
          </p>
          <p>
            <span className="font-medium">Snap to Roads:</span>{" "}
            {draft?.snapToRoads ? "On" : "Off"}
          </p>

          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/mission/new/${draftId}/route`}>
              Edit route
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h2 className="font-semibold">Milestone summary</h2>
        <div className="mt-3 space-y-2 text-sm">
          <p>
            <span className="font-medium">Milestones:</span> {milestones.length}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/mission/new/${draftId}/milestones/content`}>
              Edit milestone content
            </Link>
          </Button>
          <div className="space-y-2">
            {milestones.map((milestone, index) => (
              <div
                key={String(milestone.id ?? index)}
                className="rounded-md border p-3"
              >
                <p className="font-medium">
                  Milestone {String.fromCharCode(65 + index)}:{" "}
                  {String(milestone.title ?? "Untitled milestone")}
                </p>
                <p className="text-muted-foreground">
                  {Number(milestone.distanceMeters ?? 0).toLocaleString()}{" "}
                  meters from start
                </p>
                <p className="mt-2 text-muted-foreground">
                  {String(milestone.description ?? "No description.")}
                </p>
                {Array.isArray(milestone.imageUrls) &&
                milestone.imageUrls[0] ? (
                  <div className="relative mt-3 h-40 w-full overflow-hidden rounded-md border">
                    <Image
                      src={milestone.imageUrls[0]}
                      alt={`Image for milestone ${String.fromCharCode(65 + index)}`}
                      fill
                      sizes="24rem"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
