/// <reference types="google.maps" />
"use client";

import { useEffect, useMemo, useState } from "react";
import { APIProvider, Map, Polyline } from "@vis.gl/react-google-maps";
import type { RoutePoint } from "@/types/routeTypes";

type MilestonePickerMapProps = {
  routePoints: RoutePoint[];
  snapToRoads: boolean;
};

export function MilestonePickerMap({
  routePoints,
  snapToRoads,
}: MilestonePickerMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "";

  const routePath = useMemo(
    () =>
      routePoints.map((point) => ({
        lat: point.latitude,
        lng: point.longitude,
      })),
    [routePoints],
  );
  const [displayRoutePath, setDisplayRoutePath] = useState(routePath);
  const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false);
  useEffect(() => {
    if (!isMapsApiLoaded || !snapToRoads || routePath.length < 2) {
      return;
    }

    async function calculateSnappedRoute() {
      const { Route } = (await google.maps.importLibrary(
        "routes",
      )) as google.maps.RoutesLibrary;

      const { routes } = await Route.computeRoutes({
        origin: routePath[0],
        destination: routePath[routePath.length - 1],
        intermediates: routePath.slice(1, -1).map((point) => ({
          location: point,
        })),
        travelMode: "WALKING",
        fields: ["path"],
      });

      const snappedPath = routes?.[0]?.path ?? [];
      setDisplayRoutePath(
        snappedPath.length > 0
          ? snappedPath.map((point) => ({ lat: point.lat, lng: point.lng }))
          : routePath,
      );
    }

    void calculateSnappedRoute();
  }, [isMapsApiLoaded, routePath, snapToRoads]);
  return (
    <APIProvider apiKey={apiKey} onLoad={() => setIsMapsApiLoaded(true)}>
      <Map
        className="h-80 w-full overflow-hidden rounded-lg border"
        defaultCenter={routePath[0] ?? { lat: 35.647756, lng: 139.741834 }}
        defaultZoom={12}
        mapId={mapId}
      >
        <Polyline path={displayRoutePath} strokeWeight={4} />{" "}
      </Map>
    </APIProvider>
  );
}
