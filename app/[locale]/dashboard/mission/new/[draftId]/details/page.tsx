import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { updateMissionDetailsAction } from "./actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateRangePicker } from "@/components/DateRangePicker";
import { MissionDetailsSubmitButton } from "@/components/MissionDetailsSubmitButton";
import { MissionDetailsSaveToast } from "@/components/MissionDetailsSaveToast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const draftStartDate = draft?.startDate ?? "";
  const draftEndDate = draft?.endDate ?? "";
  const draftGoalDistanceMeters = draft?.goalDistanceMeters ?? 0;
  const detailsSavedAt = draft?.detailsSavedAt ?? "";
  const canContinueToMilestones = canEditDraft && Boolean(detailsSavedAt);

  const updateMissionDetails = updateMissionDetailsAction.bind(null, draftId);
  return (
    <section className="space-y-6 p-8">
      <MissionDetailsSaveToast />
      {!canEditDraft && (
        <p className="rounded-md border bg-card p-3 text-base text-muted-foreground">
          You can view this mission draft, but only the creator can edit it.
        </p>
      )}
      <MissionBuilderSteps currentStepId="mission-details" />
      <h1 className="text-2xl font-semibold text-primary">Mission Details</h1>

      <form
        action={updateMissionDetails}
        className="space-y-3 rounded-lg border bg-card p-4"
      >
        <fieldset disabled={!canEditDraft} className="space-y-3 border-0 p-0">
          <label className="block text-base font-medium">Mission title</label>
          <Input
            name="title"
            defaultValue={draftTitle}
            required
            maxLength={120}
          />
          <label className="block text-base font-medium">Description</label>
          <Textarea
            name="description"
            defaultValue={draftDescription}
            maxLength={1000}
            placeholder="Describe the mission route for participants."
          />
          <div className="flex items-center gap-3 rounded-md border bg-background p-3 text-base">
            Route distance:{" "}
            <span className="font-medium">
              {draftGoalDistanceMeters} meters
            </span>
            {canEditDraft && (
              <Button asChild>
                <Link href={`/dashboard/mission/new/${draftId}/route`}>
                  Edit Route
                </Link>
              </Button>
            )}
          </div>

          <label className="block text-base font-medium">Mission dates</label>
          <DateRangePicker
            startName="startDate"
            endName="endDate"
            defaultStartValue={draftStartDate}
            defaultEndValue={draftEndDate}
          />
          <MissionDetailsSubmitButton />
        </fieldset>
      </form>
      <div className="flex justify-end">
        {canContinueToMilestones ? (
          <Button asChild>
            <Link href={`/dashboard/mission/new/${draftId}/milestones`}>
              Next: Add milestones
            </Link>
          </Button>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Button disabled>Next: Add milestones</Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>
                Save mission details before adding milestones.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <p className="text-base text-muted-foreground">Draft ID: {draftId}</p>
    </section>
  );
}
