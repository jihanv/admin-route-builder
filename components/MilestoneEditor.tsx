"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  MilestonePickerMap,
  type SelectedMilestonePosition,
} from "@/components/MilestonePickerMap";
import type { MissionMilestone, RoutePoint } from "@/types/routeTypes";
type MilestoneEditorProps = {
  draftId: string;
  routePoints: RoutePoint[];
  snapToRoads: boolean;
  milestones: MissionMilestone[];
};

export function MilestoneEditor({
  draftId,
  routePoints,
  snapToRoads,
  milestones,
}: MilestoneEditorProps) {
  const [selectedPositions, setSelectedPositions] = useState<
    SelectedMilestonePosition[]
  >([]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="min-w-0">
        <MilestonePickerMap
          routePoints={routePoints}
          snapToRoads={snapToRoads}
          milestones={milestones}
          selectedPositions={selectedPositions}
          onSelectedPositionsChange={setSelectedPositions}
        />
      </div>

      <aside className="flex h-100 flex-col gap-4 overflow-hidden rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Selected new milestone points: {selectedPositions.length}
        </p>
        <Button
          onClick={() => setSelectedPositions([])}
          disabled={selectedPositions.length === 0}
        >
          Clear selected points
        </Button>
        <ol className="max-h-88 w-full space-y-2 overflow-y-auto pr-2 text-sm">
          {selectedPositions.map((position, index) => (
            <li
              key={position.temporaryId}
              className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border bg-card px-3 py-2 text-card-foreground shadow-sm"
            >
              <div>
                <p className="font-medium">
                  Milestone {String.fromCharCode(65 + index)}
                </p>
              </div>
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

        {/* <MilestoneList milestones={milestones} /> */}
      </aside>
    </div>
  );
}
