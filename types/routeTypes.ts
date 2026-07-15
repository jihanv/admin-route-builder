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
export type MissionMilestone = {
  id: string;
  title: string;
  description: string;
  distanceMeters: number;
  position: RoutePoint;
  imageUrls: string[];
};
export type Mission = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  goalDistanceMeters: number;
  fundraisingGoalCents: number;
  routePoints: RoutePoint[];
  snappedRoutePoints: RoutePoint[];
  snapToRoads: boolean;
  milestones: MissionMilestone[];
  createdByAdminId: string;
  createdAt: string;
  updatedAt: string;
  status: "published";
};
export type RouteDraft = {
  id?: string;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  goalDistanceMeters?: number;
  fundraisingGoalCents?: number;
  routePoints?: RoutePoint[];
  snappedRoutePoints?: RoutePoint[];
  milestones?: MissionMilestone[];
  createdByAdminId?: string;
  createdAt?: string;
  detailsSavedAt?: string;
  routeLockedAt?: string;
  updatedAt?: string;
  expiresAt?: Date;
  status?: "draft";
  snapToRoads?: boolean;
};
