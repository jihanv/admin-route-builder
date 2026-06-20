import { RouteBuilderMap } from "@/components/RouteBuilderMap";
import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateNewMissionPage() {
  return (
    <section className="space-y-6 p-8">
      <MissionBuilderSteps currentStepId="route-picker" />
      <div>
        <h1 className="text-2xl font-semibold text-primary">Route Picker</h1>
      </div>
      <RouteBuilderMap />
      <div className="flex justify-end">
        <div className="flex justify-end">
          <Button disabled>Next: Mission Details</Button>
        </div>
      </div>
    </section>
  );
}
