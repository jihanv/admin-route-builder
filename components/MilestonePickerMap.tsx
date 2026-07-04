/// <reference types="google.maps" />
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  Polyline,
  useMap,
  type MapMouseEvent,
} from "@vis.gl/react-google-maps";
import type { MissionMilestone, RoutePoint } from "@/types/routeTypes";

type MilestonePickerMapProps = {
  routePoints: RoutePoint[];
  snapToRoads: boolean;
  milestones: MissionMilestone[];
  selectedPositions?: SelectedMilestonePosition[];
  onSelectedPositionsChange?: React.Dispatch<
    React.SetStateAction<SelectedMilestonePosition[]>
  >;
};

export type SelectedMilestonePosition = RoutePoint & {
  routePathIndex: number;
  temporaryId: string;
  distanceMeters: number;
};

export function MilestonePickerMap({
  routePoints,
  snapToRoads,
  milestones,
  selectedPositions,
  onSelectedPositionsChange,
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
  const [localSelectedPositions, setLocalSelectedPositions] = useState<
    SelectedMilestonePosition[]
  >([]);
  const visibleSelectedPositions = selectedPositions ?? localSelectedPositions;
  const updateSelectedPositions =
    onSelectedPositionsChange ?? setLocalSelectedPositions;

  const handleMapClick = (event: MapMouseEvent) => {
    const position = event.detail.latLng;
    if (!position || displayRoutePath.length === 0 || !spherical) return;

    const clickedPoint = { lat: position.lat, lng: position.lng };
    const closestRoutePoint = displayRoutePath.reduce(
      (closest, point, index) => {
        const closestDistance =
          (closest.point.lat - clickedPoint.lat) ** 2 +
          (closest.point.lng - clickedPoint.lng) ** 2;
        const pointDistance =
          (point.lat - clickedPoint.lat) ** 2 +
          (point.lng - clickedPoint.lng) ** 2;
        return pointDistance < closestDistance ? { point, index } : closest;
      },
      { point: displayRoutePath[0], index: 0 },
    );

    updateSelectedPositions((currentPositions) =>
      [
        ...currentPositions,
        {
          latitude: closestRoutePoint.point.lat,
          longitude: closestRoutePoint.point.lng,
          routePathIndex: closestRoutePoint.index,
          temporaryId: crypto.randomUUID(),
          distanceMeters: getDistanceMetersToRoutePathIndex(
            closestRoutePoint.index,
          ),
        },
      ].sort((a, b) => a.routePathIndex - b.routePathIndex),
    );
  };

  const getDistanceMetersToRoutePathIndex = (routePathIndex: number) => {
    if (!spherical) return 0;

    return Math.round(
      spherical.computeLength(displayRoutePath.slice(0, routePathIndex + 1)),
    );
  };

  const [isMapsApiLoaded, setIsMapsApiLoaded] = useState(false);
  const [spherical, setSpherical] = useState<
    google.maps.GeometryLibrary["spherical"] | null
  >(null);
  useEffect(() => {
    if (!isMapsApiLoaded) return;

    async function loadGeometryLibrary() {
      const { spherical } = (await google.maps.importLibrary(
        "geometry",
      )) as google.maps.GeometryLibrary;

      setSpherical(() => spherical);
    }

    void loadGeometryLibrary();
  }, [isMapsApiLoaded]);
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
        className="h-100 w-full overflow-hidden rounded-lg border"
        defaultCenter={routePath[0] ?? { lat: 35.647756, lng: 139.741834 }}
        defaultZoom={12}
        mapId={mapId}
        onClick={handleMapClick}
      >
        {displayRoutePath.length > 0 && (
          <AdvancedMarker position={displayRoutePath[0]}>
            <div className="flex flex-col items-center">
              <div className="bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white shadow-md [clip-path:polygon(0_0,100%_0,100%_75%,50%_100%,0_75%)]">
                START
              </div>
              <div className="h-6 w-1 bg-slate-500 shadow-sm" />
            </div>
          </AdvancedMarker>
        )}
        {displayRoutePath.length > 1 && (
          <AdvancedMarker
            position={displayRoutePath[displayRoutePath.length - 1]}
          >
            <div className="flex flex-col items-center">
              <div className="bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-md [clip-path:polygon(0_0,100%_0,100%_75%,50%_100%,0_75%)]">
                END
              </div>
              <div className="h-6 w-1 bg-slate-500 shadow-sm" />
            </div>
          </AdvancedMarker>
        )}
        <RouteBoundsFitter routePath={displayRoutePath} />
        {milestones.map((milestone) => (
          <AdvancedMarker
            key={milestone.id}
            position={{
              lat: milestone.position.latitude,
              lng: milestone.position.longitude,
            }}
          />
        ))}
        {visibleSelectedPositions.map((position, index) => (
          <AdvancedMarker
            key={position.temporaryId}
            position={{
              lat: position.latitude,
              lng: position.longitude,
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
        <Polyline path={displayRoutePath} strokeWeight={4} />{" "}
      </Map>
      {/* {visibleSelectedPositions.length > 0 && (
        <p className="mt-2 text-sm text-muted-foreground">
          Selected milestone points: {visibleSelectedPositions.length}
        </p>
      )} */}
    </APIProvider>
  );
}

function RouteBoundsFitter({
  routePath,
}: {
  routePath: { lat: number; lng: number }[];
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || routePath.length < 2) return;

    const bounds = new google.maps.LatLngBounds();
    routePath.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, 48);
  }, [map, routePath]);

  return null;
}
