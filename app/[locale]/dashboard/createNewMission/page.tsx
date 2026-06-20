import { RouteBuilderMap } from "@/components/RouteBuilderMap";
import { missionBuilderSteps } from "@/types/builderSteps";
import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";

export default function CreateNewMissionPage() {
  const routePickerStep = missionBuilderSteps[0];

  return (
    <section className="space-y-6 p-8">
      <MissionBuilderSteps currentStepId="route-picker" />
      <div>
        <h1 className="text-2xl font-semibold text-primary">Route Picker</h1>
      </div>
      <RouteBuilderMap />
    </section>
  );
}
