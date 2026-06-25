"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function MissionDetailsSaveToast() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("saved") === "1")
      toast.success("Mission details saved.");
  }, [searchParams]);

  return null;
}
