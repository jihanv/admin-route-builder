"use client";

import { RouteBuilderMap } from "@/components/RouteBuilderMap";
import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CreateNewMissionPage() {
  const [savedDraftId, setSavedDraftId] = useState<string | null>(null);
  return (
    <section className="space-y-6 p-8">
      <MissionBuilderSteps currentStepId="route-picker" />
      <div>
        <h1 className="text-2xl font-semibold text-primary">Route Picker</h1>
      </div>
      <RouteBuilderMap
        onDraftSaved={setSavedDraftId}
        onRouteChanged={() => setSavedDraftId(null)}
      />
      <div className="flex flex-col items-end gap-2">
        {savedDraftId ? (
          <Button asChild>
            <Link href={`/dashboard/mission/new/${savedDraftId}/details`}>
              Next: Mission Details
            </Link>
          </Button>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button disabled>Next: Mission Details</Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Save the route draft to continue.</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </section>
  );
}
