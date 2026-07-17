import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/firebaseAdmin";
import type { RoutePoint } from "@/types/routeTypes";
import { RouteBuilderMap } from "@/components/RouteBuilderMap";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type EditRoutePageProps = {
  params: Promise<{ draftId: string }>;
};

export default async function EditRoutePage({ params }: EditRoutePageProps) {
  const { draftId } = await params;
  const { userId, sessionClaims } = await auth();
  const adminRole =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

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
        You can view this draft, but only the creator can edit the route.
      </div>
    );
  }
  if (adminRole !== "admin") return <div>Access denied</div>;

  const routePoints = Array.isArray(draft?.routePoints)
    ? (draft.routePoints as RoutePoint[])
    : [];
  const snappedRoutePoints = Array.isArray(draft?.snappedRoutePoints)
    ? (draft.snappedRoutePoints as RoutePoint[])
    : [];
  const goalDistanceMeters =
    typeof draft?.goalDistanceMeters === "number"
      ? draft.goalDistanceMeters
      : 0;

  const snapToRoads = draft?.snapToRoads === true;

  return (
    <section className="space-y-6 p-8">
      <main className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Edit Route</h1>
        </div>
        <RouteBuilderMap
          initialDraftId={draftId}
          initialRoutePoints={routePoints}
          initialGoalDistanceMeters={goalDistanceMeters}
          initialSnapToRoads={snapToRoads}
          initialSnappedRoutePoints={snappedRoutePoints}
        />
        <Button asChild>
          <Link href={`/dashboard/missions/new/${draftId}/details`}>
            Back to Details
          </Link>
        </Button>
      </main>
    </section>
  );
}
