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
      <ol className="space-y-1 text-sm">
        {selectedPositions.map((position, index) => (
          <li key={`${position.latitude}-${position.longitude}-${index}`}>
            {String.fromCharCode(65 + index)}. {position.latitude.toFixed(6)},{" "}
            {position.longitude.toFixed(6)}
          </li>
        ))}
      </ol>
      {selectedPositions.length > 0 && (
        <Button onClick={() => setSelectedPositions([])}>
          Clear selected points
        </Button>
      )}
      <MilestoneList milestones={milestones} />
    </>
  );
}
