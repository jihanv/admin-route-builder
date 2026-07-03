"use client";

import { useState } from "react";
import { MilestoneList } from "@/components/MilestoneList";
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
      <MilestoneList milestones={milestones} />
    </>
  );
}
