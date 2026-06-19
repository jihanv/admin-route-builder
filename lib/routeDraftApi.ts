import type { RouteDraft } from "@/types/routeTypes";

type SaveRouteDraftInput = Pick<
  RouteDraft,
  "title" | "description" | "startDate" | "goalDistanceMeters" | "routePoints"
> & { id?: string | null };

export async function saveRouteDraft(draft: SaveRouteDraftInput) {
  const url = draft.id ? `/api/route-drafts/${draft.id}` : "/api/route-drafts";
  const method = draft.id ? "PATCH" : "POST";

  return fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });
}
