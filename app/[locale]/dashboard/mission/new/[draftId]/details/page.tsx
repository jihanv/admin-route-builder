import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { updateMissionDetailsAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/DatePicker";

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
        <p className="mt-2 text-sm text-muted-foreground">
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

  const updateMissionDetails = updateMissionDetailsAction.bind(null, draftId);
  return (
    <section className="space-y-6 p-8">
      {!canEditDraft && (
        <p className="rounded-md border bg-card p-3 text-sm text-muted-foreground">
          You can view this mission draft, but only the creator can edit it.
        </p>
      )}
      <MissionBuilderSteps currentStepId="mission-details" />
      <h1 className="text-2xl font-semibold text-primary">Mission Details</h1>

      <form
        action={updateMissionDetails}
        className="space-y-3 rounded-lg border bg-card p-4"
      >
        <label className="block text-sm font-medium">Mission title</label>
        <Input name="title" defaultValue={draftTitle} />
        <label className="block text-sm font-medium">Description</label>
        <Textarea
          name="description"
          defaultValue={draftDescription}
          placeholder="Describe the mission route for participants."
        />
        <label className="block text-sm font-medium">Start date</label>
        <DatePicker name="startDate" defaultValue={draftStartDate} />
        <Button type="submit">Save Details</Button>
      </form>
      <p className="text-sm text-muted-foreground">Draft ID: {draftId}</p>
    </section>
  );
}
