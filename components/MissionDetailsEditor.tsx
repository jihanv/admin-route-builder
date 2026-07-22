"use client";

import type { ComponentProps } from "react";
import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";
import { MissionDetailsSaveToast } from "@/components/MissionDetailsSaveToast";
import { MissionDetailsNextButton } from "@/components/MissionDetailsNextButton";
import { HeroBannerImageEditor } from "@/components/HeroBannerImageEditor";
import type { HeroBannerImageAsset } from "@/types/routeTypes";

type MissionDetailsEditorProps = ComponentProps<"form"> & {
  draftId: string;
  canEditDraft: boolean;
  canContinueToMilestones: boolean;
  savedHeroBannerImageAsset?: HeroBannerImageAsset;
};

export function MissionDetailsEditor({
  draftId,
  canEditDraft,
  canContinueToMilestones,
  savedHeroBannerImageAsset,
  children,
  ...formProps
}: MissionDetailsEditorProps) {
  return (
    <>
      <section className="space-y-6 p-8">
        <MissionDetailsSaveToast />
        {!canEditDraft && (
          <p className="rounded-md border bg-card p-3 text-base text-muted-foreground">
            You can view this mission draft, but only the creator can edit it.
          </p>
        )}
        <MissionBuilderSteps currentStepId="mission-details" />
        <h1 className="text-2xl font-semibold text-primary">Mission Details</h1>
        <form {...formProps} data-draft-id={draftId}>
          <fieldset disabled={!canEditDraft} className="space-y-3 border-0 p-0">
            <HeroBannerImageEditor
              savedImageAsset={savedHeroBannerImageAsset}
            />
            {children}
          </fieldset>
        </form>
        <div className="flex justify-end">
          <MissionDetailsNextButton
            href={`/dashboard/missions/new/${draftId}/milestones`}
            canContinue={canContinueToMilestones}
            formId="mission-details-form"
          />
        </div>
      </section>
    </>
  );
}
