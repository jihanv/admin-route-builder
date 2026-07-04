"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type MissionDetailsSubmitButtonProps = {
  disabledReason?: string;
};

export function MissionDetailsSubmitButton({
  disabledReason,
}: MissionDetailsSubmitButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = pending || Boolean(disabledReason);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="w-fit">
            <Button type="submit" disabled={isDisabled} className="min-w-28">
              {pending ? "Saving..." : "Save Details"}
            </Button>
          </span>
        </TooltipTrigger>
        {disabledReason && <TooltipContent>{disabledReason}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
}
