"use client";

import { RouteBuilderMap } from "@/components/RouteBuilderMap";
import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function CreateNewMissionPage() {
  const [savedDraftId, setSavedDraftId] = useState<string | null>(null);
  return (
    <section className="space-y-6 p-8">
      <MissionBuilderSteps currentStepId="route-picker" />
      <div>
        <h1 className="text-2xl font-semibold text-primary">Route Picker</h1>
      </div>
      <RouteBuilderMap onDraftSaved={setSavedDraftId} />
      <div className="flex justify-end">
        <div className="flex justify-end">
          <Button disabled>Next: Mission Details</Button>
        </div>
      </div>
    </section>
  );
}
