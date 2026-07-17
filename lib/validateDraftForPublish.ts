import type { RouteDraft } from "@/types/routeTypes";

export function validateDraftForPublish(draft: RouteDraft) {
  if (!draft.title) {
    throw new Error("Mission title is required");
  }

  if (!draft.startDate || !draft.endDate) {
    throw new Error("Mission dates are required");
  }

  if (!draft.routePoints || draft.routePoints.length === 0) {
    throw new Error("Mission route is required");
  }

  if (!draft.milestones || draft.milestones.length === 0) {
    throw new Error("At least one milestone is required");
  }
}
