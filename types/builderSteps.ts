export type MissionBuilderStepId =
  | "route-picker"
  | "mission-details"
  | "milestones"
  | "review-publish";

export const missionBuilderSteps = [
  { id: "route-picker", label: "Route Picker" },
  { id: "mission-details", label: "Mission Details" },
  { id: "milestones", label: "Milestones" },
  { id: "review-publish", label: "Review / Publish" },
] as const;
