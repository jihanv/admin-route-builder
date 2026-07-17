import "server-only";

import type { RouteDraft } from "@/types/routeTypes";

export function assertRouteDraftOwnership(draft: RouteDraft, userId: string) {
  if (draft.createdByAdminId !== userId) {
    throw new Error("You do not have permission to modify this draft");
  }
}
