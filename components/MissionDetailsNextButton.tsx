"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MissionDetailsNextButtonProps = {
  href: string;
  canContinue: boolean;
  formId: string;
};

function getFormSnapshot(form: HTMLFormElement) {
  const formData = new FormData(form);

  return JSON.stringify({
    title: formData.get("title") ?? "",
    description: formData.get("description") ?? "",
    fundraisingGoalDollars: formData.get("fundraisingGoalDollars") ?? "",
    startDate: formData.get("startDate") ?? "",
    endDate: formData.get("endDate") ?? "",
  });
}

export function MissionDetailsNextButton({
  href,
  canContinue,
  formId,
}: MissionDetailsNextButtonProps) {
  const initialSnapshotRef = useRef("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const form = document.getElementById(formId);

    if (!(form instanceof HTMLFormElement)) return;

    initialSnapshotRef.current = getFormSnapshot(form);

    const updateDirtyState = () => {
      setHasUnsavedChanges(
        getFormSnapshot(form) !== initialSnapshotRef.current,
      );
    };

    const updateDirtyStateSoon = () => {
      window.setTimeout(updateDirtyState, 0);
    };

    form.addEventListener("input", updateDirtyState);
    form.addEventListener("change", updateDirtyState);
    form.addEventListener("click", updateDirtyStateSoon);

    return () => {
      form.removeEventListener("input", updateDirtyState);
      form.removeEventListener("change", updateDirtyState);
      form.removeEventListener("click", updateDirtyStateSoon);
    };
  }, [formId]);

  const disabledReason = !canContinue
    ? "Save mission details before adding milestones."
    : hasUnsavedChanges
      ? "Save your changes before adding milestones."
      : "";

  if (!disabledReason) {
    return (
      <Button asChild>
        <Link href={href}>Next: Add milestones</Link>
      </Button>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <Button disabled>Next: Add milestones</Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>{disabledReason}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
