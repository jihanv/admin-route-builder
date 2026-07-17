"use client";

import { RouteBuilderMap } from "@/components/RouteBuilderMap";
import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { saveRouteDraft } from "@/lib/routeDraftApi";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CreateNewMissionPage() {
  const [savedDraftId, setSavedDraftId] = useState<string | null>(null);
  const [isLockingRoute, setIsLockingRoute] = useState(false);

  const handleContinue = async () => {
    if (!savedDraftId) return;

    setIsLockingRoute(true);

    try {
      const response = await saveRouteDraft({
        id: savedDraftId,
        routeLockedAt: new Date().toISOString(),
      });

      if (!response.ok) throw new Error("Route lock failed");

      window.location.assign(`/dashboard/missions/new/${savedDraftId}/details`);
    } catch (error) {
      console.error("Route lock failed:", error);
      toast.error("Could not continue to mission details.");
      setIsLockingRoute(false);
    }
  };
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
          <Button onClick={handleContinue} disabled={isLockingRoute}>
            {isLockingRoute ? "Continuing..." : "Next: Mission Details"}
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
