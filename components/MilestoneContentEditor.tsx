"use client";

import type { MissionMilestone } from "@/types/routeTypes";

type MilestoneContentEditorProps = {
  milestones: MissionMilestone[];
};

export function MilestoneContentEditor({
  milestones,
}: MilestoneContentEditorProps) {
  return (
    <div className="space-y-3">
      {milestones.map((milestone, index) => (
        <div key={milestone.id} className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold">
            Milestone {String.fromCharCode(65 + index)}
          </h2>
          <p className="text-sm text-muted-foreground">
            {milestone.distanceMeters} meters from start
          </p>
        </div>
      ))}
    </div>
  );
}
