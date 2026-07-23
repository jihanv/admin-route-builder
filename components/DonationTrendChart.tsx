"use client";

import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
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

function getRangeStartTimestamp(
  range: DonationRange,
  asOfTimestamp: number,
): number | null {
  if (range === "ALL") return null;

  const startDate = new Date(asOfTimestamp * 1000);

  if (range === "1D") startDate.setUTCDate(startDate.getUTCDate() - 1);
  if (range === "1W") startDate.setUTCDate(startDate.getUTCDate() - 7);
  if (range === "1M") startDate.setUTCMonth(startDate.getUTCMonth() - 1);
  if (range === "3M") startDate.setUTCMonth(startDate.getUTCMonth() - 3);
  if (range === "6M") startDate.setUTCMonth(startDate.getUTCMonth() - 6);
  if (range === "1Y") startDate.setUTCFullYear(startDate.getUTCFullYear() - 1);

  if (range === "YTD") {
    startDate.setUTCMonth(0, 1);
    startDate.setUTCHours(0, 0, 0, 0);
  }

  return Math.floor(startDate.getTime() / 1000);
}

function getVisibleTrendData(
  data: DonationTrendPoint[],
  range: DonationRange,
  asOfTimestamp: number,
): DonationTrendPoint[] {
  const startTimestamp = getRangeStartTimestamp(range, asOfTimestamp);

  if (startTimestamp === null) {
    return data.filter((point) => point.created <= asOfTimestamp);
  }

  const earlierPoints = data.filter((point) => point.created < startTimestamp);
  const pointsInRange = data.filter(
    (point) =>
      point.created >= startTimestamp && point.created <= asOfTimestamp,
  );

  const startingTotal =
    earlierPoints[earlierPoints.length - 1]?.totalCents ?? 0;
  const endingTotal =
    pointsInRange[pointsInRange.length - 1]?.totalCents ?? startingTotal;

  return [
    { created: startTimestamp, totalCents: startingTotal },
    ...pointsInRange,
    { created: asOfTimestamp, totalCents: endingTotal },
  ];
}

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
  const visibleData = getVisibleTrendData(data, selectedRange, asOfTimestamp);
  return (
    <div>
      <p className="text-sm font-medium text-muted-foreground">Net donations</p>

      <p className="mt-1 text-3xl font-semibold">
        {formatCurrencyFromCents(totalDonationsCents)}
      </p>

      <ChartContainer
        config={chartConfig}
        className="mt-6 h-[clamp(10rem,24vh,16rem)] w-full aspect-auto"
        aria-label="Cumulative net donations over time"
      >
        <AreaChart
          accessibilityLayer
          data={visibleData}
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

          <ChartTooltip
            content={
              <ChartTooltipContent
                hideIndicator
                labelFormatter={(_, payload) => {
                  const created = payload[0]?.payload?.created;

                  return typeof created === "number"
                    ? new Date(created * 1000).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "";
                }}
                formatter={(value) => (
                  <span className="font-mono font-medium">
                    {formatCurrencyFromCents(Number(value))}
                  </span>
                )}
              />
            }
          />
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
