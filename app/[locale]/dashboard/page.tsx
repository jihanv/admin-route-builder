import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getDashboardSummary } from "@/lib/dashboardService";

export default async function AdminPage() {
  const summary = await getDashboardSummary();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">REI Mission Builder</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {summary.activeMissions.length} active missions
      </p>
    </main>
  );
}
