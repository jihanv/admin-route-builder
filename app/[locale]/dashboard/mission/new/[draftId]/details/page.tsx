import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";

export default async function MissionDetailsPage({
  params,
}: {
  params: Promise<{ draftId: string }>;
}) {
  const { draftId } = await params;
  return (
    <section className="space-y-6 p-8">
      <MissionBuilderSteps currentStepId="mission-details" />
      <h1 className="text-2xl font-semibold text-primary">Mission Details</h1>
      <p className="text-sm text-muted-foreground">Draft ID: {draftId}</p>
    </section>
  );
}
