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
import type { RoutePoint } from "@/types/routeTypes";

type ReviewRouteMapProps = {
  routePoints: RoutePoint[];
  snapToRoads: boolean;
};

export function ReviewRouteMap({
  routePoints,
  snapToRoads,
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
        {routePath[0] ? <AdvancedMarker position={routePath[0]} /> : null}
        {routePath.length > 1 ? (
          <AdvancedMarker position={routePath[routePath.length - 1]} />
        ) : null}
        <RouteBoundsFitter routePath={displayRoutePath} />
        <Polyline
          path={displayRoutePath}
          strokeColor="#00000"
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
