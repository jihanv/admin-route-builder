"use client";
import { useState } from "react";
import {
  APIProvider,
  Map,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import type { RoutePoint } from "@/types/routeTypes";

export function RouteBuilderMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);

  const handleMapClick = (event: MapMouseEvent) => {
    const position = event.detail.latLng;
    if (!position) return;
    setRoutePoints([
      ...routePoints,
      { latitude: position.lat, longitude: position.lng },
    ]);
  };
  return (
    <>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={{ lat: 49.2827, lng: -123.1207 }}
          defaultZoom={12}
          onClick={handleMapClick}
        />
        <div className="absolute right-3 top-3 rounded-md bg-background/90 px-3 py-2 text-sm shadow">
          Points: {routePoints.length}
        </div>
      </APIProvider>
    </>
  );
}
