"use client";
import { useEffect } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  Polyline,
  useMap,
} from "@vis.gl/react-google-maps";
import type { RoutePoint } from "@/types/routeTypes";

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
}: {
  routePoints: RoutePoint[];
  snappedRoutePoints?: RoutePoint[];
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const displayedPoints =
    snappedRoutePoints.length >= 2 ? snappedRoutePoints : routePoints;

  const routePath = displayedPoints.map(({ latitude, longitude }) => ({
    lat: latitude,
    lng: longitude,
  }));

  const firstPoint = displayedPoints[0];
  const lastPoint = displayedPoints[displayedPoints.length - 1];
  if (!firstPoint) return null;
  return (
    <APIProvider apiKey={apiKey}>
      <Map
        className="h-80 w-full rounded-md"
        defaultCenter={{ lat: firstPoint.latitude, lng: firstPoint.longitude }}
        defaultZoom={12}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
      >
        <AdvancedMarker position={routePath[0]} title="Route start">
          S
        </AdvancedMarker>
        <AdvancedMarker
          position={routePath[routePath.length - 1]}
          title="Route end"
        >
          E
        </AdvancedMarker>
        <FitRouteBounds path={routePath} />
      </Map>
    </APIProvider>
  );
}
