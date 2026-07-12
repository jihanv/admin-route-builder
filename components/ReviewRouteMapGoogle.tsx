"use client";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import type { RoutePoint } from "@/types/routeTypes";
export function ReviewRouteMapGoogle({
  routePoints,
  snappedRoutePoints = [],
}: {
  routePoints: RoutePoint[];
  snappedRoutePoints?: RoutePoint[];
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const displayedPoints =
    snappedRoutePoints.length >= 2 ? snappedRoutePoints : routePoints;
  const firstPoint = displayedPoints[0];
  if (!firstPoint) return null;
  return (
    <APIProvider apiKey={apiKey}>
      <Map
        className="h-96 w-full rounded-md"
        defaultCenter={{ lat: firstPoint.latitude, lng: firstPoint.longitude }}
        defaultZoom={12}
      />
    </APIProvider>
  );
}
