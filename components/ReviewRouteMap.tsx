"use client";
import dynamic from "next/dynamic";
import type { MissionMilestone, RoutePoint } from "@/types/routeTypes";

const GoogleMap = dynamic(
  () =>
    import("./ReviewRouteMapGoogle").then(
      (module) => module.ReviewRouteMapGoogle,
    ),
  { ssr: false },
);

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
    <GoogleMap
      routePoints={routePoints}
      snappedRoutePoints={snappedRoutePoints}
      milestones={milestones}
    />
  );
}
