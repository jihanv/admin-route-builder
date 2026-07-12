"use client";
import dynamic from "next/dynamic";
import type { MissionMilestone, RoutePoint } from "@/types/routeTypes";

const LeafletMap = dynamic(() => import("./ReviewRouteMapLeaflet"), {
  ssr: false,
});

type ReviewRouteMapProps = {
  routePoints: RoutePoint[];
  snappedRoutePoints?: RoutePoint[];
  milestones: MissionMilestone[];
};

export function ReviewRouteMap({
  routePoints,
  snappedRoutePoints,
  milestones,
}: ReviewRouteMapProps) {
  return (
    <LeafletMap
      routePoints={routePoints}
      snappedRoutePoints={snappedRoutePoints}
      milestones={milestones}
    />
  );
}
