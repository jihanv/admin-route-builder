"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import type { RoutePoint } from "@/types/routeTypes";

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
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
