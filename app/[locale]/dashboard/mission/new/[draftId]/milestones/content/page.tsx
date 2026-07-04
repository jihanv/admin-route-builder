import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";
export default async function MilestoneContentPage({
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
    return <div>Only the creator can edit milestone content.</div>;
  }

  const milestones = Array.isArray(draft?.milestones) ? draft.milestones : [];

  return (
    <section className="space-y-6 p-8">
      <MissionBuilderSteps currentStepId="milestones" />
      <h1 className="text-2xl font-semibold text-primary">Milestone Content</h1>
      <p className="text-base text-muted-foreground">
        This draft has {milestones.length} milestone positions ready for
        content.
      </p>
      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="rounded-lg border bg-card p-4">
            <h2 className="font-semibold">
              Milestone {String.fromCharCode(65 + index)}
            </h2>
            <p className="text-sm text-muted-foreground">
              {milestone.distanceMeters} meters from start
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
