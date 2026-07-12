"use client";

import { useEffect } from "react";
import * as L from "leaflet";
import { useMap } from "react-leaflet";
import "@maplibre/maplibre-gl-leaflet";

export function OpenFreeMapLayer() {
  const map = useMap();

  useEffect(() => {
    const layer = L.maplibreGL({
      style: "https://tiles.openfreemap.org/styles/positron",
    }).addTo(map);

    return () => {
      layer.remove();
    };
  }, [map]);

  return null;
}
