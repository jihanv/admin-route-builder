import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";

export default function MissionDetailsPage() {
  return (
    <section className="space-y-6 p-8">
      <MissionBuilderSteps currentStepId="mission-details" />
      <div>
        <h1 className="text-2xl font-semibold text-primary">Mission Details</h1>
        <p className="text-sm text-muted-foreground">
          Mission title, description, start date, and goal distance will go
          here.
        </p>
      </div>
    </section>
  );
}
