import type { RouteDraft } from "@/types/routeTypes";

export function isRouteDraftOwner(draft: RouteDraft, userId: string): boolean {
  return draft.createdByAdminId === userId;
}
