"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function MissionDetailsSaveToast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("saved") === "1") {
      toast.success("Mission details saved.", { id: "mission-details-saved" });
      router.replace(pathname, { scroll: false });
    }

    if (searchParams.get("error") === "validation") {
      toast.error("Please check the mission details and try again.", {
        id: "mission-details-validation-error",
      });
      router.replace(pathname, { scroll: false });
    }
    if (searchParams.get("error") === "image") {
      toast.error("The hero image could not be saved. Please try again.", {
        id: "mission-details-image-error",
      });
      router.replace(pathname, { scroll: false });
    }
  }, [pathname, router, searchParams]);

  return null;
}
