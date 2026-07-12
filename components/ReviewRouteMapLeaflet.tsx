"use client";
import { CircleMarker, MapContainer, Polyline } from "react-leaflet";
import type { RoutePoint } from "@/types/routeTypes";
import { OpenFreeMapLayer } from "@/components/OpenFreeMapLayer";

export default function ReviewRouteMapLeaflet({
  routePoints,
}: {
  routePoints: RoutePoint[];
}) {
  const firstPoint = routePoints[0];
  const routePositions: [number, number][] = routePoints.map((point) => [
    point.latitude,
    point.longitude,
  ]);

  if (!firstPoint) return null;
  const lastPoint = routePoints.at(-1) ?? firstPoint;

  return (
    <MapContainer
      bounds={routePositions}
      boundsOptions={{ padding: [40, 40] }}
      className="h-96 w-full rounded-md"
    >
      <OpenFreeMapLayer />
      <Polyline positions={routePositions} />
      <CircleMarker
        center={[firstPoint.latitude, firstPoint.longitude]}
        radius={8}
        pathOptions={{ color: "green", fillOpacity: 1 }}
      />
      <CircleMarker
        center={[lastPoint.latitude, lastPoint.longitude]}
        radius={8}
        pathOptions={{ color: "red", fillOpacity: 1 }}
      />
    </MapContainer>
  );
}
