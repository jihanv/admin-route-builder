import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";

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
    </section>
  );
}
