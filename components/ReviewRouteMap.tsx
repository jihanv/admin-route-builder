"use client";
import dynamic from "next/dynamic";
import type { MissionMilestone, RoutePoint } from "@/types/routeTypes";

const LeafletMap = dynamic(() => import("./ReviewRouteMapLeaflet"), {
  ssr: false,
});

type ReviewRouteMapProps = {
  routePoints: RoutePoint[];
  milestones: MissionMilestone[];
};

export function ReviewRouteMap({ routePoints }: ReviewRouteMapProps) {
  return <LeafletMap routePoints={routePoints} />;
}
