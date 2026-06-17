import type { RoutePoint } from "@/types/routeTypes";

export async function saveRouteDraft(routePoints: RoutePoint[]) {
  return fetch("/api/route-drafts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: "Untitled Route",
      routePoints,
    }),
  });
}
