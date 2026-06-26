"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function MissionDetailsSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="min-w-28">
      {pending ? "Saving..." : "Save Details"}
    </Button>
  );
}
