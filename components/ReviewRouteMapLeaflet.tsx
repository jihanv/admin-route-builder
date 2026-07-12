"use client";
import { MapContainer } from "react-leaflet";
import type { RoutePoint } from "@/types/routeTypes";
import { OpenFreeMapLayer } from "@/components/OpenFreeMapLayer";

export default function ReviewRouteMapLeaflet({
  routePoints,
}: {
  routePoints: RoutePoint[];
}) {
  const firstPoint = routePoints[0];

  if (!firstPoint) return null;

  return (
    <MapContainer
      center={[firstPoint.latitude, firstPoint.longitude]}
      zoom={13}
      className="h-96 w-full rounded-md"
    >
      <OpenFreeMapLayer />
    </MapContainer>
  );
}
