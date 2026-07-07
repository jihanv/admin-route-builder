/// <reference types="google.maps" />
"use client";
import { useEffect, useRef, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  ControlPosition,
  Map,
  MapControl,
  Polyline,
  useMapsLibrary,
  useMap,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import type { RoutePoint } from "@/types/routeTypes";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { saveRouteDraft } from "@/lib/routeDraftApi";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

function getStraightLineDistanceMeters(points: RoutePoint[]) {
  return points.slice(1).reduce((total, point, index) => {
    const previous = points[index];
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const earthRadiusMeters = 6371000;
    const latChange = toRadians(point.latitude - previous.latitude);
    const lngChange = toRadians(point.longitude - previous.longitude);
    const startLat = toRadians(previous.latitude);
    const endLat = toRadians(point.latitude);
    const a =
      Math.sin(latChange / 2) ** 2 +
      Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngChange / 2) ** 2;
    return (
      total + 2 * earthRadiusMeters * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    );
  }, 0);
}

function getRoutePointsKey(points: RoutePoint[]) {
  return points
    .map((point) => `${point.latitude},${point.longitude}`)
    .join("|");
}

type RouteBuilderMapProps = {
  initialDraftId?: string;
  initialRoutePoints?: RoutePoint[];
  initialGoalDistanceMeters?: number;
  initialSnapToRoads?: boolean;
  onDraftSaved?: (draftId: string) => void;
  onRouteChanged?: () => void;
};

export function RouteBuilderMap({
  initialDraftId,
  initialRoutePoints,
  initialGoalDistanceMeters,
  initialSnapToRoads,
  onDraftSaved,
  onRouteChanged,
}: RouteBuilderMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? "";
  const [routePoints, setRoutePoints] = useState<RoutePoint[]>(
    initialRoutePoints ?? [],
  );
  const [snapToRoads, setSnapToRoads] = useState(initialSnapToRoads ?? false);
  const [snappedRoutePath, setSnappedRoutePath] = useState<
    { lat: number; lng: number }[]
  >([]);
  const [snappedDistanceMeters, setSnappedDistanceMeters] = useState<
    number | null
  >(null);
  const [snappedRouteKey, setSnappedRouteKey] = useState<string | null>(null);
  const [isSnappingRoute, setIsSnappingRoute] = useState(false);
  const snapRequestIdRef = useRef(0);
  const hasCalculatedInitialSnapRef = useRef(false);
  const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(initialDraftId ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const isMobile = useIsMobile();
  const markRouteUnsaved = () => onRouteChanged?.();

  const handleSaveDraft = async () => {
    setIsSaving(true);
    const isUpdatingExistingDraft = Boolean(draftId);

    try {
      const response = await saveRouteDraft({
        id: draftId,
        title: "Untitled Route",
        goalDistanceMeters: Math.round(routeDistanceMeters),
        snapToRoads,
        routePoints,
      });

      if (!response.ok) {
        toast.error("Could not save draft.");
        return;
      }

      const savedDraft = await response.json();
      setDraftId(savedDraft.id);
      onDraftSaved?.(savedDraft.id);
      toast.success(
        isUpdatingExistingDraft ? "Draft updated." : "Draft created.",
      );
    } catch (error) {
      console.error("Save draft failed:", error);
      toast.error("Could not save draft.");
    } finally {
      setIsSaving(false);
    }
  };

  const toGooglePoint = (point: RoutePoint) => ({
    lat: point.latitude,
    lng: point.longitude,
  });

  const currentRouteKey = getRoutePointsKey(routePoints);
  const initialRouteKey = getRoutePointsKey(initialRoutePoints ?? []);
  const isUsingInitialSavedDistance =
    initialGoalDistanceMeters !== undefined &&
    routePoints.length > 0 &&
    currentRouteKey === initialRouteKey;

  const hasCurrentSnappedRoute =
    snappedRouteKey === currentRouteKey && snappedRoutePath.length > 0;

  const shouldShowPendingSnappedRoute =
    snapToRoads && isSnappingRoute && snappedRoutePath.length > 0;

  const displayRoutePath =
    snapToRoads && (hasCurrentSnappedRoute || shouldShowPendingSnappedRoute)
      ? snappedRoutePath
      : routePoints.map(toGooglePoint);

  const routeDistanceMeters = isUsingInitialSavedDistance
    ? initialGoalDistanceMeters
    : snapToRoads && hasCurrentSnappedRoute && snappedDistanceMeters !== null
      ? snappedDistanceMeters
      : getStraightLineDistanceMeters(routePoints);

  const routeDistanceLabel = isSnappingRoute
    ? "Calculating..."
    : routeDistanceMeters >= 1000
      ? `${(routeDistanceMeters / 1000).toFixed(2)} km`
      : `${Math.round(routeDistanceMeters)} m`;

  const snapTooltipMessage = !isMapsApiLoaded
    ? "Loading Google Maps tools..."
    : routePoints.length < 2
      ? "Add at least 2 route points to enable Snap to Roads."
      : "Use Google walking paths where available.";

  const isSnapToggleDisabled =
    isSaving || isSnappingRoute || !isMapsApiLoaded || routePoints.length < 2;

  const handleMapClick = async (event: MapMouseEvent) => {
    if (isSaving) {
      return;
    }
    const position = event.detail.latLng;
    if (!position) return;
    markRouteUnsaved();

    const nextRoutePoints = [
      ...routePoints,
      { latitude: position.lat, longitude: position.lng },
    ];

    setRoutePoints(nextRoutePoints);
    setSnappedDistanceMeters(null);
    setSnappedRouteKey(null);

    if (snapToRoads) {
      await calculateSnappedRoute(nextRoutePoints);
    }
  };

  const handleResetRoute = () => {
    markRouteUnsaved();
    setRoutePoints([]);
    setSnappedRoutePath([]);
    setSnappedDistanceMeters(null);
    setSnappedRouteKey(null);
    setSnapToRoads(false);
  };

  const handleUndoRoutePoint = async () => {
    markRouteUnsaved();
    const nextRoutePoints = routePoints.slice(0, -1);

    setRoutePoints(nextRoutePoints);
    setSnappedDistanceMeters(null);
    setSnappedRouteKey(null);

    if (!snapToRoads) return;
    if (nextRoutePoints.length < 2) setSnapToRoads(false);
    await calculateSnappedRoute(nextRoutePoints);
  };

  const calculateSnappedRoute = async (points: RoutePoint[]) => {
    if (points.length < 2) {
      setSnappedRoutePath([]);
      setSnappedDistanceMeters(null);
      setSnappedRouteKey(null);
      return;
    }

    const routePointsKey = getRoutePointsKey(points);

    const requestId = snapRequestIdRef.current + 1;
    snapRequestIdRef.current = requestId;

    setIsSnappingRoute(true);
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
        fields: ["path", "distanceMeters"],
      };

      const { routes } = await Route.computeRoutes(request);

      if (requestId !== snapRequestIdRef.current) {
        return;
      }
      const routePath = routes?.[0]?.path ?? [];
      setSnappedDistanceMeters(routes?.[0]?.distanceMeters ?? null);
      if (routePath.length === 0) {
        toast.error(
          "Could not calculate a walking route. Showing straight line instead.",
        );
        setSnappedRoutePath([]);
        setSnappedDistanceMeters(null);
        setSnappedRouteKey(null);
        return;
      }

      setSnappedRoutePath(
        routePath.map((point) => ({ lat: point.lat, lng: point.lng })),
      );

      setSnappedRouteKey(routePointsKey);
    } catch (error) {
      console.error("Route snap failed:", error);
      toast.error(
        "Could not calculate a walking route. Showing straight line instead.",
      );
      setSnappedRoutePath([]);
      setSnappedDistanceMeters(null);
      setSnappedRouteKey(null);
    } finally {
      setIsSnappingRoute(false);
    }
  };

  const handleSnapToRoadsChange = async (checked: boolean) => {
    markRouteUnsaved();
    setSnapToRoads(checked);

    if (!checked) {
      return;
    }

    const currentRouteKey = getRoutePointsKey(routePoints);

    if (snappedRouteKey === currentRouteKey && snappedRoutePath.length > 0) {
      return;
    }

    await calculateSnappedRoute(routePoints);
  };

  return (
    <APIProvider
      apiKey={apiKey}
      libraries={["routes", "places"]}
      onLoad={async () => {
        await google.maps.importLibrary("routes");
        setIsMapsApiLoaded(true);

        if (
          initialSnapToRoads &&
          routePoints.length >= 2 &&
          !hasCalculatedInitialSnapRef.current
        ) {
          hasCalculatedInitialSnapRef.current = true;
          await calculateSnappedRoute(routePoints);
        }
      }}
    >
      <div className="mb-3 flex flex-col gap-3 rounded-lg border bg-card p-3 text-card-foreground sm:flex-row sm:items-center sm:justify-between">
        {" "}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center">
          <Button
            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            variant="outline"
            onClick={handleResetRoute}
            disabled={routePoints.length === 0 || isSaving || isSnappingRoute}
          >
            Reset
          </Button>
          <Button
            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            variant="outline"
            onClick={handleUndoRoutePoint}
            disabled={routePoints.length === 0 || isSaving || isSnappingRoute}
          >
            Undo
          </Button>
          <Button
            className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground min-w-28"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={routePoints.length === 0 || isSaving || isSnappingRoute}
          >
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
        </div>
        <div className="rounded-md border bg-background px-3 py-2 text-sm font-medium text-primary">
          Distance:{" "}
          <span className="text-muted-foreground">{routeDistanceLabel}</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-md border bg-primary/10 px-4 py-2">
          <span className="text-sm font-medium text-foreground">
            Snap to Roads
          </span>
          <div className="flex items-center gap-3">
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
      </div>

      <div className="relative">
        {!isMapsApiLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg border bg-card/80">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
        <Map
          mapTypeControl={!isMobile}
          className="h-100 w-full overflow-hidden rounded-lg border"
          defaultCenter={{ lat: 35.647756, lng: 139.741834 }}
          defaultZoom={12}
          mapId={mapId}
          onClick={handleMapClick}
        >
          <MapControl position={ControlPosition.TOP_CENTER}>
            <PlaceSearchControl />
          </MapControl>
          {routePoints.map((point, index) => (
            <AdvancedMarker
              key={`${point.latitude}-${point.longitude}-${index}`}
              position={{ lat: point.latitude, lng: point.longitude }}
            />
          ))}
          <Polyline path={displayRoutePath} strokeWeight={4} />
        </Map>
      </div>

      {/* <div className="mt-3 rounded-lg border bg-card p-4 text-card-foreground">
        <p className="mb-2 text-sm font-medium">
          Route Points ({routePoints.length})
        </p>
        <RoutePointList routePoints={routePoints} />
        <Button
          className="mb-3"
          variant="outline"
          onClick={handleResetRoute}
          disabled={routePoints.length === 0 || isSaving}
        >
          Clear Route
        </Button>
      </div> */}
    </APIProvider>
  );
}

function PlaceSearchControl() {
  const searchControlRef = useRef<HTMLDivElement>(null);
  const placesLibrary = useMapsLibrary("places");
  const map = useMap();
  useEffect(() => {
    if (!placesLibrary || !searchControlRef.current) return;

    const placeAutocomplete = new placesLibrary.PlaceAutocompleteElement({});
    placeAutocomplete.style.width = "100%";

    placeAutocomplete.addEventListener("gmp-select", async (event) => {
      const { placePrediction } =
        event as google.maps.places.PlacePredictionSelectEvent;
      const place = placePrediction.toPlace();

      await place.fetchFields({ fields: ["displayName", "location"] });
      if (!place.location || !map) return;

      map.panTo(place.location);
      map.setZoom(15);
      console.log(place.displayName, place.location?.toJSON());
    });
    searchControlRef.current.replaceChildren(placeAutocomplete);
  }, [placesLibrary, map]);

  return <div ref={searchControlRef} className="mt-3 w-56 sm:w-72" />;
}
