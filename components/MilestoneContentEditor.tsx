"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import type {
  MissionMilestone,
  RouteDraftMilestoneImageAsset,
} from "@/types/routeTypes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveRouteDraft, uploadMilestoneImage } from "@/lib/routeDraftApi";
import { toast } from "sonner";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { resizeMilestoneImageFile } from "@/lib/milestoneImageResize";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";

type MilestoneContentEditorProps = {
  draftId: string;
  milestones: MissionMilestone[];
  milestoneImageAssets: RouteDraftMilestoneImageAsset[];
};

export function MilestoneContentEditor({
  draftId,
  milestones,
}: MilestoneContentEditorProps) {
  const [isSaving, setIsSaving] = useState(false);

  const [titlesByMilestoneId, setTitlesByMilestoneId] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(
      milestones.map((milestone) => [milestone.id, milestone.title]),
    ),
  );

  const [descriptionsByMilestoneId, setDescriptionsByMilestoneId] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(
      milestones.map((milestone) => [milestone.id, milestone.description]),
    ),
  );

  const hasEmptyMilestoneTitle = Object.values(titlesByMilestoneId).some(
    (title) => !title.trim(),
  );
  const [imageUrlsByMilestoneId, setImageUrlsByMilestoneId] = useState<
    Record<string, string>
  >(() =>
    Object.fromEntries(
      milestones.map((milestone) => [
        milestone.id,
        milestone.imageUrls[0] ?? "",
      ]),
    ),
  );
  const [imageFilesByMilestoneId, setImageFilesByMilestoneId] = useState<
    Record<string, File>
  >({});

  const [savedContent, setSavedContent] = useState(() => ({
    titles: titlesByMilestoneId,
    descriptions: descriptionsByMilestoneId,
  }));
  const hasUnsavedChanges =
    milestones.some(
      ({ id }) =>
        titlesByMilestoneId[id] !== savedContent.titles[id] ||
        descriptionsByMilestoneId[id] !== savedContent.descriptions[id],
    ) || Object.keys(imageFilesByMilestoneId).length > 0;
  const [imagePreviewUrlsByMilestoneId, setImagePreviewUrlsByMilestoneId] =
    useState<Record<string, string>>({});
  const previewUrlsRef = useRef<string[]>([]);
  const canReview = !hasUnsavedChanges && !hasEmptyMilestoneTitle;
  useEffect(() => {
    const previewUrls = previewUrlsRef.current;

    return () => {
      previewUrls.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
    };
  }, []);

  const handleMilestoneImageChange = async (
    milestoneId: string,
    imageFile?: File,
  ) => {
    if (!imageFile) return;

    const previewUrl = URL.createObjectURL(imageFile);

    previewUrlsRef.current.push(previewUrl);

    setImageFilesByMilestoneId((currentFiles) => ({
      ...currentFiles,
      [milestoneId]: imageFile,
    }));

    setImagePreviewUrlsByMilestoneId((currentPreviewUrls) => ({
      ...currentPreviewUrls,
      [milestoneId]: previewUrl,
    }));
  };

  const handleSaveMilestoneContent: ComponentProps<"form">["onSubmit"] = async (
    event,
  ) => {
    event.preventDefault();

    if (hasEmptyMilestoneTitle) {
      toast.error("Fill in every milestone title before saving.");
      return;
    }

    setIsSaving(true);

    try {
      const uploadedImageUrlsByMilestoneId = { ...imageUrlsByMilestoneId };

      for (const milestone of milestones) {
        const imageFile = imageFilesByMilestoneId[milestone.id];

        if (!imageFile) continue;

        const resizedImageFile = await resizeMilestoneImageFile(imageFile);
        const uploadResponse = await uploadMilestoneImage(
          draftId,
          resizedImageFile,
        );
        const uploadResult = (await uploadResponse.json()) as {
          imageUrl?: string;
          error?: string;
        };

        if (!uploadResponse.ok || !uploadResult.imageUrl) {
          toast.error(
            uploadResult.error ?? "Could not upload milestone image.",
          );
          return;
        }

        uploadedImageUrlsByMilestoneId[milestone.id] = uploadResult.imageUrl;
      }

      const nextMilestones = milestones.map((milestone) => {
        const imageUrl = uploadedImageUrlsByMilestoneId[milestone.id]?.trim();

        return {
          ...milestone,
          title: titlesByMilestoneId[milestone.id].trim(),
          description: descriptionsByMilestoneId[milestone.id].trim(),
          imageUrls: imageUrl ? [imageUrl] : [],
        };
      });

      const response = await saveRouteDraft({
        id: draftId,
        milestones: nextMilestones,
      });

      if (!response.ok) {
        toast.error("Could not save milestone content.");
        return;
      }

      setImageUrlsByMilestoneId(uploadedImageUrlsByMilestoneId);
      setSavedContent({
        titles: { ...titlesByMilestoneId },
        descriptions: { ...descriptionsByMilestoneId },
      });
      setImageFilesByMilestoneId({});
      setImagePreviewUrlsByMilestoneId({});

      toast.success("Milestone content saved.");
    } catch (error) {
      console.error("Save milestone content failed:", error);
      toast.error("Could not save milestone content.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Dialog open={isSaving}>
        <DialogContent
          className="text-center"
          showCloseButton={false}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <div
            role="status"
            aria-label="Saving"
            className="mx-auto size-8 animate-spin rounded-full border-4 border-muted border-t-primary"
          />
          <DialogTitle>Saving milestone content</DialogTitle>
          <DialogDescription>
            Please do not close this window while images and milestone content
            are being saved.
          </DialogDescription>
        </DialogContent>
      </Dialog>

      <form
        id={`milestone-content-form-${draftId}`}
        className="space-y-3"
        onSubmit={handleSaveMilestoneContent}
      >
        {milestones.map((milestone, index) => (
          <div key={milestone.id} className="rounded-lg border bg-card p-4">
            <h2 className="font-semibold">
              Milestone {String.fromCharCode(65 + index)}
            </h2>
            <p className="text-sm text-muted-foreground">
              {milestone.distanceMeters} meters from start
            </p>
            <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="flex h-full flex-col gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor={`title-${milestone.id}`}
                    className="text-sm font-medium"
                  >
                    Title
                  </label>
                  <Input
                    name={`title-${milestone.id}`}
                    value={titlesByMilestoneId[milestone.id] ?? ""}
                    onChange={(event) => {
                      setTitlesByMilestoneId((currentTitles) => ({
                        ...currentTitles,
                        [milestone.id]: event.target.value,
                      }));
                    }}
                    placeholder={`Milestone ${String.fromCharCode(65 + index)} title`}
                    aria-invalid={!titlesByMilestoneId[milestone.id]?.trim()}
                    aria-describedby={`title-status-${milestone.id}`}
                  />
                  <p
                    id={`title-status-${milestone.id}`}
                    className={`h-5 text-sm ${
                      titlesByMilestoneId[milestone.id]?.trim()
                        ? "text-green-600"
                        : "text-destructive"
                    }`}
                  >
                    {titlesByMilestoneId[milestone.id]?.trim()
                      ? "✓ Title added."
                      : "Title is required."}
                  </p>
                </div>

                <div className="flex flex-1 flex-col gap-1">
                  <label
                    className="text-sm font-medium"
                    htmlFor={`description-${milestone.id}`}
                  >
                    Description
                  </label>
                  <Textarea
                    id={`description-${milestone.id}`}
                    className="min-h-32 flex-1"
                    name={`description-${milestone.id}`}
                    value={descriptionsByMilestoneId[milestone.id] ?? ""}
                    onChange={(event) => {
                      setDescriptionsByMilestoneId((currentDescriptions) => ({
                        ...currentDescriptions,
                        [milestone.id]: event.target.value,
                      }));
                    }}
                    placeholder="Write the message users will see when they reach this milestone."
                  />
                </div>
              </div>

              <div className="flex h-full flex-col gap-2">
                <label
                  htmlFor={`imageFile-${milestone.id}`}
                  className="text-sm font-medium"
                >
                  Milestone image
                </label>
                <label
                  htmlFor={`imageFile-${milestone.id}`}
                  className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-background p-6 text-center hover:bg-muted/50"
                >
                  {imagePreviewUrlsByMilestoneId[milestone.id] ||
                  imageUrlsByMilestoneId[milestone.id] ? (
                    <div className="relative h-48 w-full overflow-hidden rounded-md">
                      <Image
                        src={
                          imagePreviewUrlsByMilestoneId[milestone.id] ||
                          imageUrlsByMilestoneId[milestone.id]
                        }
                        alt={`Preview for milestone ${String.fromCharCode(65 + index)}`}
                        fill
                        sizes="20rem"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">Choose an image</span>
                      <span className="mt-1 text-sm text-muted-foreground">
                        PNG, JPG, or WebP. Upload happens when you save.
                      </span>
                    </>
                  )}
                </label>
                <Input
                  id={`imageFile-${milestone.id}`}
                  name={`imageFile-${milestone.id}`}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) =>
                    handleMilestoneImageChange(
                      milestone.id,
                      event.target.files?.[0],
                    )
                  }
                />
                {imagePreviewUrlsByMilestoneId[milestone.id] ? (
                  <p className="text-sm text-muted-foreground">
                    New image selected. It will upload when you save.
                  </p>
                ) : imageUrlsByMilestoneId[milestone.id] ? (
                  <p className="text-sm text-muted-foreground">Saved image</p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-block">
                <Button
                  type="submit"
                  disabled={
                    isSaving || hasEmptyMilestoneTitle || !hasUnsavedChanges
                  }
                >
                  {isSaving
                    ? "Saving milestone content..."
                    : !hasUnsavedChanges
                      ? "Saved"
                      : "Save milestone content"}
                </Button>
              </span>
            </TooltipTrigger>
            {hasEmptyMilestoneTitle ? (
              <TooltipContent>
                Fill in every milestone title before saving.
              </TooltipContent>
            ) : null}
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-block">
                {canReview ? (
                  <Button asChild>
                    <Link href={`/dashboard/mission/new/${draftId}/review`}>
                      Next: Review Mission
                    </Link>
                  </Button>
                ) : (
                  <Button type="button" disabled>
                    Next: Review Mission
                  </Button>
                )}
              </span>
            </TooltipTrigger>
            {!canReview ? (
              <TooltipContent>
                Save milestone content before continuing.
              </TooltipContent>
            ) : null}
          </Tooltip>
        </TooltipProvider>
      </form>
    </>
  );
}
