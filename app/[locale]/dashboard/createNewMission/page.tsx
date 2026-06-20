import { RouteBuilderMap } from "@/components/RouteBuilderMap";
import { missionBuilderSteps } from "@/types/builderSteps";

export default function CreateNewMissionPage() {
  const routePickerStep = missionBuilderSteps[0];

  return (
    <section className="space-y-6 p-8">
      <div>
        <p className="text-lg font-black text-muted-foreground">Step 1</p>
        <h1 className="text-2xl font-semibold text-primary">
          {routePickerStep.label}
        </h1>
      </div>
      <RouteBuilderMap />
    </section>
  );
}
