"use client";
import { useEffect } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Polyline,
  useMap,
} from "@vis.gl/react-google-maps";
import type { MissionMilestone, RoutePoint } from "@/types/routeTypes";

function FitRouteBounds({ path }: { path: { lat: number; lng: number }[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || path.length < 2) return;
    const bounds = new google.maps.LatLngBounds();
    path.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, 48);
  }, [map, path]);

  return null;
}

export function ReviewRouteMapGoogle({
  routePoints,
  snappedRoutePoints = [],
  milestones,
}: {
  routePoints: RoutePoint[];
  snappedRoutePoints?: RoutePoint[];
  milestones: MissionMilestone[];
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const displayedPoints =
    snappedRoutePoints.length >= 2 ? snappedRoutePoints : routePoints;

  const routePath = displayedPoints.map(({ latitude, longitude }) => ({
    lat: latitude,
    lng: longitude,
  }));

  const firstPoint = displayedPoints[0];
  if (!firstPoint) return null;
  return (
    <APIProvider apiKey={apiKey}>
      <Map
        className="h-80 w-full rounded-md"
        defaultCenter={{ lat: firstPoint.latitude, lng: firstPoint.longitude }}
        defaultZoom={12}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
      >
        <Polyline path={routePath} strokeColor="#000000" strokeWeight={5} />
        <AdvancedMarker position={routePath[0]} title="Route start">
          <div className="flex flex-col items-center">
            <div className="bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white shadow-md [clip-path:polygon(0_0,100%_0,100%_75%,50%_100%,0_75%)]">
              START
            </div>
            <div className="h-6 w-1 bg-slate-500 shadow-sm" />
          </div>
        </AdvancedMarker>
        <AdvancedMarker
          position={routePath[routePath.length - 1]}
          title="Route finish"
        >
          <div className="flex flex-col items-center">
            <div className="bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-md [clip-path:polygon(0_0,100%_0,100%_75%,50%_100%,0_75%)]">
              FINISH
            </div>
            <div className="h-6 w-1 bg-slate-500 shadow-sm" />
          </div>
        </AdvancedMarker>
        {milestones.map((milestone, index) => (
          <AdvancedMarker
            key={milestone.id}
            position={{
              lat: milestone.position.latitude,
              lng: milestone.position.longitude,
            }}
            title={`Milestone ${String.fromCharCode(65 + index)}: ${milestone.title}`}
          >
            <div className="flex items-start">
              <div className="h-8 w-1 rounded bg-zinc-700" />
              <div className="-ml-px rounded-r-sm bg-orange-500 px-2 py-1 text-xs font-bold text-white shadow">
                {String.fromCharCode(65 + index)}
              </div>
            </div>
          </AdvancedMarker>
        ))}
        <FitRouteBounds path={routePath} />
      </Map>
    </APIProvider>
  );
}
