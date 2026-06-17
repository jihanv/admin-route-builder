import type { RouteDraft } from "@/types/routeTypes";

type SaveRouteDraftInput = Pick<RouteDraft, "title" | "routePoints">;

export async function saveRouteDraft(draft: SaveRouteDraftInput) {
  return fetch("/api/route-drafts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(draft),
  });
}
