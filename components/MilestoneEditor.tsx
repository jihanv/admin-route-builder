"use client";

import { MilestoneList } from "@/components/MilestoneList";
import { MilestonePickerMap } from "@/components/MilestonePickerMap";
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
  return (
    <>
      <MilestonePickerMap
        routePoints={routePoints}
        snapToRoads={snapToRoads}
        milestones={milestones}
      />
      <MilestoneList milestones={milestones} />
    </>
  );
}
