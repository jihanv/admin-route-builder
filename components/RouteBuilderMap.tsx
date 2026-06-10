"use client";

import { APIProvider, Map } from "@vis.gl/react-google-maps";

export function RouteBuilderMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  return (
    <APIProvider apiKey={apiKey}>
      <Map defaultCenter={{ lat: 49.2827, lng: -123.1207 }} defaultZoom={12} />
    </APIProvider>
  );
}
