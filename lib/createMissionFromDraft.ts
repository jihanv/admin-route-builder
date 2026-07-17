import type { Mission, RouteDraft } from "@/types/routeTypes";

export function createMissionFromDraft(
  draftId: string,
  draft: RouteDraft,
): Mission {
  return {
    id: draftId,
    title: draft.title ?? "",
    description: draft.description ?? "",
    ...(draft.heroBannerImageAsset
      ? { heroBannerImageAsset: draft.heroBannerImageAsset }
      : {}),
    startDate: draft.startDate ?? "",
    endDate: draft.endDate ?? "",
    goalDistanceMeters: draft.goalDistanceMeters ?? 0,
    fundraisingGoalCents: draft.fundraisingGoalCents ?? 0,
    routePoints: draft.routePoints ?? [],
    snappedRoutePoints: draft.snappedRoutePoints ?? [],
    snapToRoads: draft.snapToRoads ?? false,
    milestones: draft.milestones ?? [],
    milestoneImageAssets: draft.milestoneImageAssets ?? [],
    createdByAdminId: draft.createdByAdminId ?? "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "published",
  };
}
