import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";
import { MilestoneContentEditor } from "@/components/MilestoneContentEditor";

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
      <MilestoneContentEditor milestones={milestones} />
    </section>
  );
}
