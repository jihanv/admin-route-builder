import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardSummary } from "@/lib/dashboardService";
import { formatCurrencyFromCents } from "@/lib/formatters";
import { CircleDollarSign, HandCoins, MapPinned, Users } from "lucide-react";

export default async function AdminPage() {
  const summary = await getDashboardSummary();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">REI Mission Builder</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <MapPinned
                aria-hidden="true"
                className="size-9 rounded-lg bg-orange-100 p-2 text-orange-600"
              />
              Active Missions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {summary.activeMissions.length} missions are published and
              happening right now.
            </p>
          </CardHeader>

          <CardContent className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Mission links
            </p>

            {summary.activeMissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No missions are active today.
              </p>
            ) : (
              <div className="space-y-2">
                {summary.activeMissions.map((mission) => (
                  <Button
                    key={mission.id}
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href="/dashboard/mission/current">
                      Mission: {mission.title}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CircleDollarSign
                aria-hidden="true"
                className="size-9 rounded-lg bg-emerald-100 p-2 text-emerald-600"
              />
              Total Donations
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Paid donations minus successful refunds
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">
              {formatCurrencyFromCents(summary.totalDonationsCents)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users
                aria-hidden="true"
                className="size-9 rounded-lg bg-blue-100 p-2 text-blue-600"
              />
              Total Donors
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Unique donors from successful donations
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{summary.totalDonors}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <HandCoins
                aria-hidden="true"
                className="size-9 rounded-lg bg-pink-100 p-2 text-pink-600"
              />
              Average Donation
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Average net amount per successful donation
            </p>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-semibold">
              {formatCurrencyFromCents(summary.averageDonationCents)}
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
