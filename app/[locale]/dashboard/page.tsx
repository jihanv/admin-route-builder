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
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <CircleDollarSign
                aria-hidden="true"
                className="size-9 rounded-lg bg-emerald-100 p-2 text-emerald-600"
              />
              Total Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">
              {formatCurrencyFromCents(summary.totalDonationsCents)}
            </p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Users
                aria-hidden="true"
                className="size-9 rounded-lg bg-blue-100 p-2 text-blue-600"
              />
              Total Donors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{summary.totalDonors}</p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <HandCoins
                aria-hidden="true"
                className="size-9 rounded-lg bg-pink-100 p-2 text-pink-600"
              />
              Average Donation
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-2xl font-semibold">
              {formatCurrencyFromCents(summary.averageDonationCents)}
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4">
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
              <div className="divide-y">
                {summary.activeMissions.map((mission) => (
                  <Link
                    key={mission.id}
                    href="/dashboard/mission/current"
                    className="grid grid-cols-[2.5rem_1fr_auto] gap-x-3 gap-y-1 py-4"
                  >
                    <span className="row-span-3 flex size-10 items-center justify-center rounded-md bg-orange-100">
                      <MapPinned
                        aria-hidden="true"
                        className="size-5 text-orange-600"
                      />
                    </span>

                    <span className="font-medium">{mission.title}</span>

                    <span className="font-semibold">
                      {mission.fundraisingPercentage}%
                    </span>

                    <span className="text-sm text-muted-foreground">
                      {formatCurrencyFromCents(mission.amountRaisedCents)}{" "}
                      raised
                    </span>

                    <span className="col-span-2 col-start-2 h-2 overflow-hidden rounded-full bg-muted">
                      <span
                        className="block h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min(mission.fundraisingPercentage, 100)}%`,
                        }}
                      />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
