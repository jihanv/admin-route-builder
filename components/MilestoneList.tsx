import type { MissionMilestone } from "@/types/routeTypes";

type MilestoneListProps = {
  milestones: MissionMilestone[];
};

export function MilestoneList({ milestones }: MilestoneListProps) {
  if (milestones.length === 0) {
    return <p className="text-sm text-muted-foreground">No milestones yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {milestones.map((milestone) => (
        <li key={milestone.id}>{milestone.title}</li>
      ))}
    </ul>
  );
}
