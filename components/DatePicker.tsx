"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

export function DatePicker({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [selectedDate, setSelectedDate] = useState(defaultValue);
  const selectedDateObject = selectedDate
    ? new Date(`${selectedDate}T00:00:00`)
    : undefined;
  return (
    <div>
      <input type="hidden" name={name} value={selectedDate} readOnly />
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline">
            {selectedDate || "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDateObject}
            onSelect={(date) =>
              setSelectedDate(date?.toLocaleDateString("en-CA") ?? "")
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
