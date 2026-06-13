/// <reference types="google.maps" />
"use client";
import { useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
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
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "";
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

    const nextRoutePoints = [
      ...routePoints,
      { latitude: position.lat, longitude: position.lng },
    ];

    setRoutePoints(nextRoutePoints);
  };

  const handleResetRoute = () => {
    setRoutePoints([]);
    setSnappedRoutePath([]);
    setSnapError("");
    setSnapToRoads(false);
  };

  const handleUndoRoutePoint = () => {
    setRoutePoints((points) => points.slice(0, -1));
    setSnappedRoutePath([]);
    setSnapError("");
    setSnapToRoads(false);
  };

  const calculateSnappedRoute = async (points: RoutePoint[]) => {
    setSnapError("");

    if (points.length < 2) {
      setSnappedRoutePath([]);
      return;
    }

    try {
      const { Route } = (await google.maps.importLibrary(
        "routes",
      )) as google.maps.RoutesLibrary;

      const origin = toGooglePoint(points[0]);
      const destination = toGooglePoint(points[points.length - 1]);
      const intermediates = points.slice(1, -1).map((point) => ({
        location: toGooglePoint(point),
      }));

      const request: google.maps.routes.ComputeRoutesRequest = {
        origin,
        destination,
        intermediates,
        travelMode: "WALKING",
        fields: ["path"],
      };

      const { routes } = await Route.computeRoutes(request);
      const routePath = routes?.[0]?.path ?? [];

      if (routePath.length === 0)
        throw new Error("No walking route path returned.");

      setSnappedRoutePath(
        routePath.map((point) => ({ lat: point.lat, lng: point.lng })),
      );
    } catch (error) {
      console.error("Route snap failed:", error);
      setSnapError(
        "Could not calculate a walking route. Showing straight line instead.",
      );
      setSnappedRoutePath([]);
    }
  };

  const handleSnapToRoadsChange = async (checked: boolean) => {
    setSnapToRoads(checked);

    if (!checked) {
      setSnappedRoutePath([]);
      setSnapError("");
      return;
    }

    await calculateSnappedRoute(routePoints);
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
            onClick={handleResetRoute}
            disabled={routePoints.length === 0}
          >
            Reset
          </Button>
          <Button
            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            variant="outline"
            onClick={handleUndoRoutePoint}
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
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <Switch
                    checked={snapToRoads}
                    onCheckedChange={handleSnapToRoadsChange}
                    disabled={isSnapToggleDisabled}
                  />
                </span>
              </TooltipTrigger>
              {isSnapToggleDisabled && (
                <TooltipContent>
                  <p>{snapTooltipMessage}</p>
                </TooltipContent>
              )}
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
          defaultCenter={{ lat: 35.647756, lng: 139.741834 }}
          defaultZoom={12}
          mapId={mapId}
          onClick={handleMapClick}
        >
          {routePoints.map((point, index) => (
            <AdvancedMarker
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
          onClick={handleResetRoute}
          disabled={routePoints.length === 0}
        >
          Clear Route
        </Button>
      </div>
    </APIProvider>
  );
}
