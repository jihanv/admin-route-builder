import { ActiveMissionsCard } from "@/components/ActiveMissionsCard";
import { DonationTrendChart } from "@/components/DonationTrendChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardSummary } from "@/lib/dashboardService";
import { formatCurrencyFromCents } from "@/lib/formatters";
import { CircleDollarSign, HandCoins, Users } from "lucide-react";

export default async function AdminPage() {
  const summary = await getDashboardSummary();
  return (
    <main className="mx-auto w-full max-w-screen-2xl p-6 lg:p-8">
      <h1 className="text-2xl font-semibold">REI Mission Builder</h1>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(19rem,0.9fr)_minmax(0,2.1fr)] lg:grid-rows-[auto_1fr]">
        <ActiveMissionsCard
          missions={summary.activeMissions}
          className="h-full lg:row-span-2"
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Card size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <CircleDollarSign
                  aria-hidden="true"
                  className="size-9 rounded-lg bg-primary/10 p-2 text-primary"
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
                  className="size-9 rounded-lg bg-primary/10 p-2 text-primary"
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
                  className="size-9 rounded-lg bg-primary/10 p-2 text-primary"
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

        <Card className="h-full">
          <CardContent>
            <DonationTrendChart
              data={summary.donationTrend}
              totalDonationsCents={summary.totalDonationsCents}
              asOfTimestamp={summary.asOfTimestamp}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
