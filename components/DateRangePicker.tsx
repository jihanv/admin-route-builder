"use client";
import type { DateRange } from "react-day-picker";
import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";

type DateRangePickerProps = {
  startName: string;
  endName: string;
  defaultStartValue?: string;
  defaultEndValue?: string;
};

export function DateRangePicker({
  startName,
  endName,
  defaultStartValue = "",
  defaultEndValue = "",
}: DateRangePickerProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultStartValue
      ? {
          from: new Date(`${defaultStartValue}T00:00:00`),
          to: defaultEndValue
            ? new Date(`${defaultEndValue}T00:00:00`)
            : undefined,
        }
      : undefined,
  );
  const formatDateForJapan = (date?: Date) =>
    date?.toLocaleDateString("en-CA", { timeZone: "Asia/Tokyo" }) ?? "";

  const buttonLabel = dateRange?.from
    ? `${formatDateForJapan(dateRange.from)}${dateRange.to ? ` - ${formatDateForJapan(dateRange.to)}` : ""}`
    : "Pick a date range";

  return (
    <div>
      <input
        type="hidden"
        name={startName}
        value={formatDateForJapan(dateRange?.from)}
        readOnly
      />
      <input
        type="hidden"
        name={endName}
        value={formatDateForJapan(dateRange?.to)}
        readOnly
      />

      <div className="inline-block rounded-lg border bg-card p-3">
        <p className="mb-3 text-sm text-muted-foreground">{buttonLabel}</p>
        <Calendar
          mode="range"
          timeZone="Asia/Tokyo"
          selected={dateRange}
          onSelect={(range) => setDateRange(range)}
          numberOfMonths={2}
        />
      </div>
    </div>
  );
}
