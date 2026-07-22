import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { updateMissionDetailsAction } from "./actions";
import { MissionDetailsEditor } from "@/components/MissionDetailsEditor";

export default async function MissionDetailsPage({
  params,
}: {
  params: Promise<{ draftId: string }>;
}) {
  const { draftId } = await params;
  const { sessionClaims, userId } = await auth();
  const adminRole =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

  if (adminRole !== "admin") {
    return (
      <section className="p-8">
        <h1 className="text-2xl font-semibold text-primary">Access denied</h1>
        <p className="mt-2 text-base text-muted-foreground">
          You do not have permission to view this mission draft.
        </p>
      </section>
    );
  }
  const draftSnapshot = await adminDb
    .collection("routeDrafts")
    .doc(draftId)
    .get();

  if (!draftSnapshot.exists) {
    return (
      <section className="p-8">
        <h1 className="text-2xl font-semibold text-primary">
          Mission does not exist
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This mission draft may have been deleted or the link is incorrect.
        </p>
      </section>
    );
  }

  const draft = draftSnapshot.data();
  const canEditDraft = draft?.createdByAdminId === userId;

  const draftTitle = draft?.title ?? "Untitled Route";
  const draftDescription = draft?.description ?? "";
  const draftHeroBannerImageAsset = draft?.heroBannerImageAsset;
  const draftStartDate = draft?.startDate ?? "";
  const draftEndDate = draft?.endDate ?? "";
  const draftGoalDistanceMeters = draft?.goalDistanceMeters ?? 0;
  const draftFundraisingGoalDollars =
    typeof draft?.fundraisingGoalCents === "number"
      ? (draft.fundraisingGoalCents / 100).toFixed(2)
      : "";
  const detailsSavedAt = draft?.detailsSavedAt ?? "";
  const canContinueToMilestones = canEditDraft && Boolean(detailsSavedAt);

  const updateMissionDetails = updateMissionDetailsAction.bind(null, draftId);
  return (
    <section className="space-y-6 p-8">
      <MissionDetailsEditor
        draftTitle={draftTitle}
        draftStartDate={draftStartDate}
        draftEndDate={draftEndDate}
        draftDescription={draftDescription}
        canContinueToMilestones={canContinueToMilestones}
        canEditDraft={canEditDraft}
        draftId={draftId}
        draftFundraisingGoalDollars={draftFundraisingGoalDollars}
        savedHeroBannerImageAsset={draftHeroBannerImageAsset}
        draftGoalDistanceMeters={draftGoalDistanceMeters}
        id="mission-details-form"
        action={updateMissionDetails}
        className="space-y-3 rounded-lg border bg-card p-4"
      ></MissionDetailsEditor>
    </section>
  );
}
