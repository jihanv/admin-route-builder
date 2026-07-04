"use client";
import type { DateRange } from "react-day-picker";
import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
  const selectedStartDate = formatDateForJapan(dateRange?.from);
  const selectedEndDate = formatDateForJapan(dateRange?.to);

  // const buttonLabel = dateRange?.from
  //   ? `${formatDateForJapan(dateRange.from)}${dateRange.to ? ` - ${formatDateForJapan(dateRange.to)}` : ""}`
  //   : "Pick a date range";

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

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-fit max-w-full justify-start"
          >
            Pick a date range
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            timeZone="Asia/Tokyo"
            selected={dateRange}
            onSelect={(range) => setDateRange(range)}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <div className="mt-2 grid gap-1 text-base text-muted-foreground sm:grid-cols-2">
        <p className="rounded-md border bg-background px-3 py-2">
          <span className="font-semibold text-foreground">Start Date:</span>{" "}
          {selectedStartDate || "Not selected yet"}
        </p>
        <p className="rounded-md border bg-background px-3 py-2">
          <span className="font-semibold text-foreground">End Date:</span>{" "}
          {selectedEndDate || "Not selected yet"}
        </p>
      </div>
    </div>
  );
}
