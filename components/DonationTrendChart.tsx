"use client";

import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import type { DonationTrendPoint } from "@/lib/dashboardCalculations";
import { formatCurrencyFromCents } from "@/lib/formatters";

const rangeOptions = [
  "1D",
  "1W",
  "1M",
  "3M",
  "6M",
  "YTD",
  "1Y",
  "ALL",
] as const;

type DonationRange = (typeof rangeOptions)[number];

const chartConfig = {
  totalCents: {
    label: "Net donations",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

type DonationTrendChartProps = {
  data: DonationTrendPoint[];
  totalDonationsCents: number;
  asOfTimestamp: number;
};

export function DonationTrendChart({
  data,
  totalDonationsCents,
  asOfTimestamp,
}: DonationTrendChartProps) {
  const [selectedRange, setSelectedRange] = useState<DonationRange>("ALL");
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
      <div className="mt-4 flex flex-wrap gap-1 border-t pt-3">
        {rangeOptions.map((range) => (
          <button
            key={range}
            type="button"
            onClick={() => setSelectedRange(range)}
            aria-pressed={selectedRange === range}
            className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              selectedRange === range
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {range}
          </button>
        ))}
      </div>
    </div>
  );
}
