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

export type MissionMilestone = {
  id: string;
  title: string;
  description: string;
  distanceMeters: number;
  position: RoutePoint;
  imageUrls: string[];
};
