export type MissionBuilderStepId =
  | "route-picker"
  | "mission-details"
  | "milestones"
  | "review-publish";

export const missionBuilderSteps = [
  { id: "route-picker", label: "Route" },
  { id: "mission-details", label: "Details" },
  { id: "milestones", label: "Milestones" },
  { id: "review-publish", label: "Review" },
] as const;
