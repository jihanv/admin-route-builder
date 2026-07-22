"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function getFormText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}
type MissionDetailsSubmitButtonProps = {
  isResizingHeroImage: boolean;
};

export function MissionDetailsSubmitButton({
  isResizingHeroImage,
}: MissionDetailsSubmitButtonProps) {
  const { pending } = useFormStatus();

  const triggerRef = useRef<HTMLSpanElement>(null);
  const [disabledReason, setDisabledReason] = useState("");

  useEffect(() => {
    const form = triggerRef.current?.closest("form");
    if (!form) return;

    const validateForm = () => {
      const formData = new FormData(form);
      const title = getFormText(formData, "title");
      const startDate = getFormText(formData, "startDate");
      const endDate = getFormText(formData, "endDate");

      if (!title) {
        setDisabledReason("Enter a mission title before saving.");
      } else if (!startDate || !endDate) {
        setDisabledReason(
          "Choose both a start date and an end date before saving.",
        );
      } else {
        setDisabledReason("");
      }
    };

    const validateSoon = () => window.setTimeout(validateForm, 0);

    validateForm();
    form.addEventListener("input", validateForm);
    form.addEventListener("change", validateForm);
    form.addEventListener("click", validateSoon);

    return () => {
      form.removeEventListener("input", validateForm);
      form.removeEventListener("change", validateForm);
      form.removeEventListener("click", validateSoon);
    };
  }, []);

  const currentDisabledReason = disabledReason;
  const isDisabled =
    pending || isResizingHeroImage || Boolean(currentDisabledReason);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span ref={triggerRef} className="inline-flex w-fit">
            <Button type="submit" disabled={isDisabled} className="w-40">
              {isResizingHeroImage
                ? "Preparing image..."
                : pending
                  ? "Saving..."
                  : "Save Details"}
            </Button>
          </span>
        </TooltipTrigger>
        {currentDisabledReason && (
          <TooltipContent>{currentDisabledReason}</TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
