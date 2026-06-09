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
