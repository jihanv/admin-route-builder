/// <reference types="google.maps" />
"use client";

import { APIProvider, Map, Polyline } from "@vis.gl/react-google-maps";
import type { RoutePoint } from "@/types/routeTypes";

type MilestonePickerMapProps = {
  routePoints: RoutePoint[];
};

export function MilestonePickerMap({ routePoints }: MilestonePickerMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "";

  const routePath = routePoints.map((point) => ({
    lat: point.latitude,
    lng: point.longitude,
  }));

  return (
    <APIProvider apiKey={apiKey}>
      <Map
        className="h-80 w-full overflow-hidden rounded-lg border"
        defaultCenter={routePath[0] ?? { lat: 35.647756, lng: 139.741834 }}
        defaultZoom={12}
        mapId={mapId}
      >
        <Polyline path={routePath} strokeWeight={4} />
      </Map>
    </APIProvider>
  );
}
