/// <reference types="google.maps" />
"use client";
import { useState } from "react";
import {
  APIProvider,
  Marker,
  Map,
  Polyline,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import type { RoutePoint } from "@/types/routeTypes";
import { RoutePointList } from "@/components/RoutePointList";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function RouteBuilderMap() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>([]);
  const [snapToRoads, setSnapToRoads] = useState(false);
  const [snappedRoutePath, setSnappedRoutePath] = useState<
    { lat: number; lng: number }[]
  >([]);
  const [snapError, setSnapError] = useState("");
  const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false);

  const toGooglePoint = (point: RoutePoint) => ({
    lat: point.latitude,
    lng: point.longitude,
  });
  const displayRoutePath =
    snapToRoads && snappedRoutePath.length > 0
      ? snappedRoutePath
      : routePoints.map(toGooglePoint);

  const snapTooltipMessage = !isMapsApiLoaded
    ? "Loading Google Maps tools..."
    : routePoints.length < 2
      ? "Add at least 2 route points to enable Snap to Roads."
      : "Use Google walking paths where available.";

  const isSnapToggleDisabled = !isMapsApiLoaded || routePoints.length < 2;

  const handleMapClick = (event: MapMouseEvent) => {
    const position = event.detail.latLng;
    if (!position) return;
    setRoutePoints([
      ...routePoints,
      { latitude: position.lat, longitude: position.lng },
    ]);
  };

  const handleSnapToRoadsChange = async (checked: boolean) => {
    setSnapToRoads(checked);

    if (!checked) {
      setSnappedRoutePath([]);
      setSnapError("");
      return;
    }

    setSnapError("");

    if (routePoints.length < 2) return;

    const { Route } = (await google.maps.importLibrary(
      "routes",
    )) as google.maps.RoutesLibrary;

    const origin = toGooglePoint(routePoints[0]);
    const destination = toGooglePoint(routePoints[routePoints.length - 1]);
  };

  return (
    <APIProvider
      apiKey={apiKey}
      libraries={["routes"]}
      onLoad={async () => {
        await google.maps.importLibrary("routes");
        setIsMapsApiLoaded(true);
      }}
    >
      <div className="mb-3 flex items-center gap-5 rounded-lg border bg-card p-3 text-card-foreground">
        <div className="flex items-center gap-2">
          <Button
            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            variant="outline"
            onClick={() => setRoutePoints([])}
            disabled={routePoints.length === 0}
          >
            Reset
          </Button>
          <Button
            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            variant="outline"
            onClick={() => setRoutePoints((points) => points.slice(0, -1))}
            disabled={routePoints.length === 0}
          >
            Undo
          </Button>
        </div>
        <div className="flex items-center gap-3 rounded-md border bg-primary/10 px-4 py-2">
          <span className="text-sm font-medium text-foreground">
            Snap to Roads
          </span>
          <TooltipProvider>
            <Tooltip open={isSnapToggleDisabled ? undefined : false}>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Switch
                    checked={snapToRoads}
                    onCheckedChange={handleSnapToRoadsChange}
                    disabled={isSnapToggleDisabled}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{snapTooltipMessage}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-sm font-medium text-muted-foreground">
            {snapToRoads ? "On" : "Off"}
          </span>
        </div>
      </div>
      {snapError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {snapError}
        </p>
      )}

      <div className="relative">
        {!isMapsApiLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg border bg-card/80">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
        <Map
          className="h-125 w-full overflow-hidden rounded-lg border"
          defaultCenter={{ lat: 49.2827, lng: -123.1207 }}
          defaultZoom={12}
          onClick={handleMapClick}
        >
          {routePoints.map((point, index) => (
            <Marker
              key={`${point.latitude}-${point.longitude}-${index}`}
              position={{ lat: point.latitude, lng: point.longitude }}
            />
          ))}
          <Polyline path={displayRoutePath} strokeWeight={4} />
        </Map>
      </div>

      <div className="mt-3 rounded-lg border bg-card p-4 text-card-foreground">
        <p className="mb-2 text-sm font-medium">
          Route Points ({routePoints.length})
        </p>
        <RoutePointList routePoints={routePoints} />
        <Button
          className="mb-3"
          variant="outline"
          onClick={() => setRoutePoints([])}
          disabled={routePoints.length === 0}
        >
          Clear Route
        </Button>
      </div>
    </APIProvider>
  );
}
