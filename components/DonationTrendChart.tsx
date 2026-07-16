"use client";

import { Area, AreaChart, XAxis, YAxis } from "recharts";

import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { DonationTrendPoint } from "@/lib/dashboardCalculations";
import { formatCurrencyFromCents } from "@/lib/formatters";

const chartConfig = {
  totalCents: {
    label: "Net donations",
    color: "var(--color-emerald-600)",
  },
} satisfies ChartConfig;

type DonationTrendChartProps = {
  data: DonationTrendPoint[];
  totalDonationsCents: number;
};

export function DonationTrendChart({
  data,
  totalDonationsCents,
}: DonationTrendChartProps) {
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">Net donations</p>

      <p className="mt-1 text-3xl font-semibold">
        {formatCurrencyFromCents(totalDonationsCents)}
      </p>

      <ChartContainer
        config={chartConfig}
        className="mt-6 h-64 w-full aspect-auto"
        aria-label="Cumulative net donations over time"
      >
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
        >
          <defs>
            <linearGradient id="donationTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-totalCents)"
                stopOpacity={0.25}
              />
              <stop
                offset="95%"
                stopColor="var(--color-totalCents)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="created"
            type="number"
            domain={["dataMin", "dataMax"]}
            hide
          />

          <YAxis domain={[0, "auto"]} hide />

          <Area
            dataKey="totalCents"
            type="linear"
            stroke="var(--color-totalCents)"
            strokeWidth={2}
            fill="url(#donationTrendFill)"
            fillOpacity={1}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
