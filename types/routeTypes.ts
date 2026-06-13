export type RoutePoint = {
  latitude: number;
  longitude: number;
};

export type AdminMissionRoute = {
  id: string;
  title: string;
  startDate: string;
  goalDistanceMeters: number;
  description: string;
  routePoints: RoutePoint[];
  createdByAdminId: string;
};

export type RouteDraft = {
  id: string;
  title: string;
  createdAt: string;
  routePoints: RoutePoint[];
};
