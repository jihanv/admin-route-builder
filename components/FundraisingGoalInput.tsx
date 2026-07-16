"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

type FundraisingGoalInputProps = {
  defaultValue: string;
};

export function FundraisingGoalInput({
  defaultValue,
}: FundraisingGoalInputProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <Input
      name="fundraisingGoalDollars"
      type="text"
      inputMode="decimal"
      value={value}
      onChange={(event) => {
        const nextValue = event.target.value;

        if (/^\d*(\.\d{0,2})?$/.test(nextValue)) {
          setValue(nextValue);
        }
      }}
      placeholder="5000.00"
      required
    />
  );
}
