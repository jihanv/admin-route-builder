/// <reference types="google.maps" />
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Polyline,
  useMap,
} from "@vis.gl/react-google-maps";
import type { MissionMilestone, RoutePoint } from "@/types/routeTypes";

type ReviewRouteMapProps = {
  routePoints: RoutePoint[];
  snapToRoads: boolean;
  milestones: MissionMilestone[];
};

export function ReviewRouteMap({
  routePoints,
  snapToRoads,
  milestones,
}: ReviewRouteMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "";
  const routePath = routePoints.map((point) => ({
    lat: point.latitude,
    lng: point.longitude,
  }));

  const [snappedRoutePath, setSnappedRoutePath] = useState<
    { lat: number; lng: number }[]
  >([]);

  const displayRoutePath =
    snapToRoads && snappedRoutePath.length > 0 ? snappedRoutePath : routePath;

  const calculateSnappedRoute = useCallback(async () => {
    if (!snapToRoads || routePoints.length < 2) return;

    const { Route } = (await google.maps.importLibrary(
      "routes",
    )) as google.maps.RoutesLibrary;

    const toGooglePoint = (point: RoutePoint) => ({
      lat: point.latitude,
      lng: point.longitude,
    });

    const request: google.maps.routes.ComputeRoutesRequest = {
      origin: toGooglePoint(routePoints[0]),
      destination: toGooglePoint(routePoints[routePoints.length - 1]),
      intermediates: routePoints.slice(1, -1).map((point) => ({
        location: toGooglePoint(point),
      })),
      travelMode: "WALKING",
      fields: ["path"],
    };

    const { routes } = await Route.computeRoutes(request);
    const routePath = routes?.[0]?.path ?? [];

    setSnappedRoutePath(
      routePath.map((point) => ({ lat: point.lat, lng: point.lng })),
    );
  }, [routePoints, snapToRoads]);

  return (
    <APIProvider
      apiKey={apiKey}
      libraries={["routes"]}
      onLoad={calculateSnappedRoute}
    >
      <Map
        className="h-80 w-full overflow-hidden rounded-lg border"
        defaultCenter={routePath[0] ?? { lat: 35.647756, lng: 139.741834 }}
        defaultZoom={12}
        mapId={mapId}
        gestureHandling="cooperative"
      >
        {displayRoutePath[0] ? (
          <AdvancedMarker position={displayRoutePath[0]}>
            <div className="flex flex-col items-center">
              <div className="bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white shadow-md [clip-path:polygon(0_0,100%_0,100%_75%,50%_100%,0_75%)]">
                START
              </div>
              <div className="h-6 w-1 bg-slate-500 shadow-sm" />
            </div>
          </AdvancedMarker>
        ) : null}
        {displayRoutePath.length > 1 ? (
          <AdvancedMarker position={displayRoutePath.at(-1)!}>
            <div className="flex flex-col items-center">
              <div className="bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-md [clip-path:polygon(0_0,100%_0,100%_75%,50%_100%,0_75%)]">
                END
              </div>
              <div className="h-6 w-1 bg-slate-500 shadow-sm" />
            </div>
          </AdvancedMarker>
        ) : null}
        <RouteBoundsFitter routePath={displayRoutePath} />
        {milestones.map((milestone, index) => (
          <AdvancedMarker
            key={String(milestone.id ?? index)}
            position={{
              lat: milestone.position.latitude,
              lng: milestone.position.longitude,
            }}
          >
            <div className="relative h-16 w-10">
              <div className="absolute bottom-0 left-0 h-16 w-1 rounded-full bg-foreground shadow-md" />
              <div className="absolute left-1 top-1 flex h-6 min-w-7 items-center justify-center rounded-r-md bg-primary px-2 text-xs font-bold text-primary-foreground shadow-md">
                {String.fromCharCode(65 + index)}
              </div>
            </div>
          </AdvancedMarker>
        ))}
        <Polyline
          path={displayRoutePath}
          strokeColor="#000000"
          strokeOpacity={1}
          strokeWeight={5}
        />
      </Map>
    </APIProvider>
  );
}

function RouteBoundsFitter({
  routePath,
}: {
  routePath: { lat: number; lng: number }[];
}) {
  const map = useMap();
  const fittedRouteKeyRef = useRef("");

  useEffect(() => {
    if (!map || routePath.length < 2) return;
    const routeKey = routePath.map(({ lat, lng }) => `${lat},${lng}`).join("|");
    if (fittedRouteKeyRef.current === routeKey) return;
    fittedRouteKeyRef.current = routeKey;

    const bounds = new google.maps.LatLngBounds();
    routePath.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, 48);
  }, [map, routePath]);

  return null;
}
