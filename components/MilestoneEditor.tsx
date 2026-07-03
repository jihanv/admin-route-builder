"use client";

import { useState } from "react";
import { MilestoneList } from "@/components/MilestoneList";
import { Button } from "@/components/ui/button";
import {
  MilestonePickerMap,
  type SelectedMilestonePosition,
} from "@/components/MilestonePickerMap";
import type { MissionMilestone, RoutePoint } from "@/types/routeTypes";

type MilestoneEditorProps = {
  routePoints: RoutePoint[];
  snapToRoads: boolean;
  milestones: MissionMilestone[];
};

export function MilestoneEditor({
  routePoints,
  snapToRoads,
  milestones,
}: MilestoneEditorProps) {
  const [selectedPositions, setSelectedPositions] = useState<
    SelectedMilestonePosition[]
  >([]);

  return (
    <>
      <MilestonePickerMap
        routePoints={routePoints}
        snapToRoads={snapToRoads}
        milestones={milestones}
        selectedPositions={selectedPositions}
        onSelectedPositionsChange={setSelectedPositions}
      />
      <p className="text-sm text-muted-foreground">
        Selected new milestone points: {selectedPositions.length}
      </p>
      {selectedPositions.length > 0 && (
        <Button onClick={() => setSelectedPositions([])}>
          Clear selected points
        </Button>
      )}
      <ol className="w-full max-w-md space-y-2 text-sm">
        {selectedPositions.map((position, index) => (
          <li
            key={position.temporaryId}
            className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border bg-card px-3 py-2 text-card-foreground shadow-sm"
          >
            <span className="font-mono text-muted-foreground">
              {String.fromCharCode(65 + index)}. {position.latitude.toFixed(6)},{" "}
              {position.longitude.toFixed(6)}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                setSelectedPositions((currentPositions) =>
                  currentPositions.filter(
                    (item) => item.temporaryId !== position.temporaryId,
                  ),
                )
              }
            >
              Remove
            </Button>
          </li>
        ))}
      </ol>

      <MilestoneList milestones={milestones} />
    </>
  );
}
