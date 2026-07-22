"use client";

import type { ComponentProps } from "react";
import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";
type MissionDetailsEditorProps = ComponentProps<"form"> & {
  draftId: string;
  canEditDraft: boolean;
};

export function MissionDetailsEditor({
  draftId,
  canEditDraft,
  children,
  ...formProps
}: MissionDetailsEditorProps) {
  return (
    <>
      <MissionBuilderSteps currentStepId="mission-details" />
      <h1 className="text-2xl font-semibold text-primary">Mission Details</h1>
      <form {...formProps} data-draft-id={draftId}>
        <fieldset disabled={!canEditDraft} className="space-y-3 border-0 p-0">
          {children}
        </fieldset>
      </form>
    </>
  );
}
