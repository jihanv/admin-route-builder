"use client";

import { useState } from "react";
import { MissionBuilderSteps } from "@/components/MissionBuilderSteps";
import { MissionDetailsSaveToast } from "@/components/MissionDetailsSaveToast";
import { MissionDetailsNextButton } from "@/components/MissionDetailsNextButton";
import { HeroBannerImageEditor } from "@/components/HeroBannerImageEditor";
import type { HeroBannerImageAsset } from "@/types/routeTypes";
import { MissionDetailsSubmitButton } from "@/components/MissionDetailsSubmitButton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FundraisingGoalInput } from "@/components/FundraisingGoalInput";
import { DateRangePicker } from "@/components/DateRangePicker";
import { updateMissionDetailsAction } from "@/lib/mission-details/updateMissionDetailsAction";
import { resizeImageFile } from "@/lib/imageResize";

type MissionDetailsEditorProps = {
  draftId: string;
  canEditDraft: boolean;
  canContinueToMilestones: boolean;
  draftTitle: string;
  draftDescription: string;
  draftStartDate: string;
  draftEndDate: string;
  draftGoalDistanceMeters: number;
  draftFundraisingGoalDollars: string;
  savedHeroBannerImageAsset?: HeroBannerImageAsset;
};

export function MissionDetailsEditor({
  draftId,
  canEditDraft,
  canContinueToMilestones,
  savedHeroBannerImageAsset,
  draftDescription,
  draftGoalDistanceMeters,
  draftStartDate,
  draftEndDate,
  draftFundraisingGoalDollars,
  draftTitle,
}: MissionDetailsEditorProps) {
  const updateMissionDetails = updateMissionDetailsAction.bind(null, draftId);

  const [preparedHeroBannerFile, setPreparedHeroBannerFile] =
    useState<File | null>(null);
  const [isResizingHeroImage, setIsResizingHeroImage] = useState(false);
  const hasUnsavedHeroImage = Boolean(preparedHeroBannerFile);
  const handleHeroBannerImageSelected = async (imageFile: File | null) => {
    setIsResizingHeroImage(true);
    try {
      const resizedImageFile = imageFile
        ? await resizeImageFile(imageFile)
        : null;
      setPreparedHeroBannerFile(resizedImageFile);
      return resizedImageFile;
    } finally {
      setIsResizingHeroImage(false);
    }
  };

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
        <form
          id="mission-details-form"
          action={updateMissionDetails}
          data-draft-id={draftId}
          className="space-y-3 rounded-lg border bg-card p-4"
        >
          <fieldset disabled={!canEditDraft} className="space-y-3 border-0 p-0">
            <HeroBannerImageEditor
              savedImageAsset={savedHeroBannerImageAsset}
              onImageSelected={handleHeroBannerImageSelected}
            />
            <label className="block text-base font-medium">Mission title</label>
            <Input
              name="title"
              defaultValue={draftTitle}
              required
              maxLength={120}
            />
            <label className="block text-base font-medium">Description</label>
            <Textarea
              name="description"
              defaultValue={draftDescription}
              maxLength={1000}
              placeholder="Describe the mission route for participants."
            />
            <label className="block text-base font-medium">
              Fundraising goal (USD)
            </label>
            <FundraisingGoalInput defaultValue={draftFundraisingGoalDollars} />
            <p className="text-sm text-muted-foreground">
              Enter the total amount this mission aims to raise.
            </p>
            <div className="flex items-center gap-3 rounded-md border bg-background p-3 text-base">
              Route distance:{" "}
              <span className="font-medium">
                {draftGoalDistanceMeters} meters
              </span>
              <p className="text-sm text-muted-foreground">
                The route is locked after it is saved.
              </p>
            </div>
            <label className="block text-base font-medium">Mission dates</label>
            <DateRangePicker
              startName="startDate"
              endName="endDate"
              defaultStartValue={draftStartDate}
              defaultEndValue={draftEndDate}
            />
            <MissionDetailsSubmitButton
              isResizingHeroImage={isResizingHeroImage}
            />
          </fieldset>
        </form>
        <div className="flex justify-end">
          <MissionDetailsNextButton
            href={`/dashboard/missions/new/${draftId}/milestones`}
            canContinue={canContinueToMilestones}
            formId="mission-details-form"
            isResizingHeroImage={isResizingHeroImage}
            hasUnsavedHeroImage={hasUnsavedHeroImage}
          />
        </div>
      </section>
    </>
  );
}
