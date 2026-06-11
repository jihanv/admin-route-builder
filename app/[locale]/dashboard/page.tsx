import { RouteBuilderMap } from "@/components/RouteBuilderMap";

export default function AdminPage() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">REI Mission Admin</h1>
      <RouteBuilderMap />
      <div className="h-125 overflow-hidden rounded-lg border"></div>
    </main>
  );
}
