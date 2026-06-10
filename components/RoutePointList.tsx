import type { RoutePoint } from "@/types/routeTypes";

export function RoutePointList({ routePoints }: { routePoints: RoutePoint[] }) {
  return (
    <ol className="space-y-1 text-sm">
      {routePoints.map((point, index) => (
        <li key={`${point.latitude}-${point.longitude}-${index}`}>
          {index + 1}. {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}
        </li>
      ))}
    </ol>
  );
}
