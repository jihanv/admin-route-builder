"use client";
import { divIcon } from "leaflet";
import { MapContainer, Marker, Polyline, Tooltip } from "react-leaflet";
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

const startLineIcon = divIcon({
  className: "",
  html: `<svg width="64" height="42" viewBox="0 0 64 42" aria-label="Start line"><path d="M8 40V4M56 40V4" stroke="#166534" stroke-width="4"/><rect x="8" y="4" width="48" height="16" rx="3" fill="#16a34a"/><text x="32" y="15" text-anchor="middle" font-family="sans-serif" font-size="9" font-weight="700" fill="white">START</text><path d="M18 40H46" stroke="#16a34a" stroke-width="4"/></svg>`,
  iconSize: [64, 42],
  iconAnchor: [32, 40],
});

const finishLineIcon = divIcon({
  className: "",
  html: `<svg width="64" height="42" viewBox="0 0 64 42" aria-label="Finish line"><path d="M8 40V4M56 40V4" stroke="#111827" stroke-width="4"/><rect x="8" y="4" width="48" height="16" fill="white" stroke="#111827"/><path d="M8 4h8v8H8zm16 0h8v8h-8zm16 0h8v8h-8zM16 12h8v8h-8zm16 0h8v8h-8zm16 0h8v8h-8z" fill="#111827"/><path d="M18 40H46" stroke="#111827" stroke-width="4"/></svg>`,
  iconSize: [64, 42],
  iconAnchor: [32, 40],
});

export default function ReviewRouteMapLeaflet({
  routePoints,
  snappedRoutePoints = [],
  milestones,
}: {
  routePoints: RoutePoint[];
  snappedRoutePoints?: RoutePoint[];
  milestones: MissionMilestone[];
}) {
  const displayedPoints =
    snappedRoutePoints.length >= 2 ? snappedRoutePoints : routePoints;
  const firstPoint = displayedPoints[0];
  const routePositions: [number, number][] = displayedPoints.map((point) => [
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
      <Marker
        position={[firstPoint.latitude, firstPoint.longitude]}
        icon={startLineIcon}
      />
      <Marker
        position={[lastPoint.latitude, lastPoint.longitude]}
        icon={finishLineIcon}
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
