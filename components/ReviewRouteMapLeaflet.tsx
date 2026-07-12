"use client";
import { divIcon } from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Tooltip,
} from "react-leaflet";
import type { MissionMilestone, RoutePoint } from "@/types/routeTypes";
import { OpenFreeMapLayer } from "@/components/OpenFreeMapLayer";

function createMilestoneFlagIcon(label: string) {
  return divIcon({
    className: "",
    html: `<svg width="30" height="34" viewBox="0 0 30 34"><path d="M4 32V2" stroke="#9a3412" stroke-width="3" stroke-linecap="round"/><path d="M5 3H27L23 10L27 17H5Z" fill="#f97316" stroke="#9a3412"/><text x="15" y="13" text-anchor="middle" font-size="10" font-weight="700" fill="white">${label}</text></svg>`,
    iconSize: [30, 34],
    iconAnchor: [4, 32],
  });
}

export default function ReviewRouteMapLeaflet({
  routePoints,
  milestones,
}: {
  routePoints: RoutePoint[];
  milestones: MissionMilestone[];
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
      {milestones.map((milestone, index) => (
        <Marker
          key={milestone.id}
          position={[milestone.position.latitude, milestone.position.longitude]}
          icon={createMilestoneFlagIcon(String.fromCharCode(65 + index))}
        >
          <Tooltip>
            {String.fromCharCode(65 + index)}: {milestone.title}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
