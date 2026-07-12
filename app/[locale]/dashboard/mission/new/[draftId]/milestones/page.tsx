import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/firebaseAdmin";
import type { MissionMilestone, RoutePoint } from "@/types/routeTypes";
import { MilestoneEditor } from "@/components/MilestoneEditor";

type MilestonesPageProps = {
  params: Promise<{ draftId: string }>;
};

export default async function MilestonesPage({ params }: MilestonesPageProps) {
  const { draftId } = await params;
  const { userId, sessionClaims } = await auth();
  const adminRole =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

  if (adminRole !== "admin") return <div>Access denied</div>;
  const draftSnapshot = await adminDb
    .collection("routeDrafts")
    .doc(draftId)
    .get();

  if (!draftSnapshot.exists) {
    return <div>Mission draft does not exist.</div>;
  }

  const draft = draftSnapshot.data();

  if (draft?.createdByAdminId !== userId) {
    return (
      <div>
        You can view this draft, but only the creator can edit milestones.
      </div>
    );
  }

  const milestones = Array.isArray(draft?.milestones)
    ? (draft.milestones as MissionMilestone[])
    : [];

  const routePoints = Array.isArray(draft?.routePoints)
    ? (draft.routePoints as RoutePoint[])
    : [];

  const snappedRoutePoints = Array.isArray(draft?.snappedRoutePoints)
    ? (draft.snappedRoutePoints as RoutePoint[])
    : [];

  const snapToRoads = draft?.snapToRoads === true;
  const goalDistanceMeters =
    typeof draft?.goalDistanceMeters === "number"
      ? draft.goalDistanceMeters
      : 0;
  return (
    <section className="space-y-6 p-8">
      <MissionBuilderSteps currentStepId="milestones" />
      <h1 className="text-2xl font-semibold text-primary">Milestones</h1>
      {/* <p className="text-sm text-muted-foreground">
        This draft currently has {milestones.length} milestones.
      </p> */}
      <MilestoneEditor
        draftId={draftId}
        routePoints={routePoints}
        snapToRoads={snapToRoads}
        milestones={milestones}
        goalDistanceMeters={goalDistanceMeters}
        snappedRoutePoints={snappedRoutePoints}
      />
    </section>
  );
}
