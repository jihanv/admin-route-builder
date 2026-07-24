import type { RouteDraft } from "@/types/routeTypes";

export function validateDraftForPublish(draft: RouteDraft) {
  if (!draft.title) {
    throw new Error("Mission title is required");
  }

  if (!draft.description) {
    throw new Error("Mission description is required");
  }

  if (!draft.startDate || !draft.endDate) {
    throw new Error("Mission dates are required");
  }

  if (draft.endDate < draft.startDate) {
    throw new Error("End date must be after start date");
  }

  if (!draft.goalDistanceMeters || draft.goalDistanceMeters <= 0) {
    throw new Error("Mission distance is required");
  }

  if (draft.fundraisingGoalCents === undefined) {
    throw new Error("Fundraising goal is required");
  }

  if (!draft.routePoints || draft.routePoints.length < 2) {
    throw new Error("Mission route is required");
  }

  if (
    draft.milestones?.some(
      (milestone) =>
        typeof milestone.title !== "string" || !milestone.title.trim(),
    )
  ) {
    throw new Error("Every milestone title is required");
  }
  if (!draft.milestonesLockedAt) {
    throw new Error("Milestone positions must be confirmed");
  }
  if (!draft.createdByAdminId) {
    throw new Error("Mission owner is required");
  }

  if (draft.status !== "draft") {
    throw new Error("Invalid draft status");
  }

  if (
    draft.snapToRoads &&
    (!draft.snappedRoutePoints || draft.snappedRoutePoints.length < 2)
  ) {
    throw new Error("Snapped route is required");
  }
}
