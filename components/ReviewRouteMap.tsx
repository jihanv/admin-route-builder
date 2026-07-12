"use client";

import type { MissionMilestone, RoutePoint } from "@/types/routeTypes";

type ReviewRouteMapProps = {
  routePoints: RoutePoint[];
  milestones: MissionMilestone[];
};

export function ReviewRouteMap({
  routePoints,
  milestones,
}: ReviewRouteMapProps) {
  return (
    <div>
      {routePoints.length} route points, {milestones.length} milestones
    </div>
  );
}
