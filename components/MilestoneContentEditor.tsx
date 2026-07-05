"use client";

import { useEffect, useRef, useState, type ComponentProps } from "react";
import type { MissionMilestone } from "@/types/routeTypes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveRouteDraft } from "@/lib/routeDraftApi";
import { toast } from "sonner";

type MilestoneContentEditorProps = {
  draftId: string;
  milestones: MissionMilestone[];
};

export function MilestoneContentEditor({
  draftId,
  milestones,
}: MilestoneContentEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
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

  const [imagePreviewUrlsByMilestoneId, setImagePreviewUrlsByMilestoneId] =
    useState<Record<string, string>>({});
  const previewUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((previewUrl) =>
        URL.revokeObjectURL(previewUrl),
      );
    };
  }, []);

  const handleMilestoneImageChange = (
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
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    const nextMilestones = milestones.map((milestone) => {
      const imageUrl = imageUrlsByMilestoneId[milestone.id]?.trim();

      return {
        ...milestone,
        title: String(formData.get(`title-${milestone.id}`) ?? "").trim(),
        description: String(
          formData.get(`description-${milestone.id}`) ?? "",
        ).trim(),
        imageUrls: imageUrl ? [imageUrl] : [],
      };
    });

    try {
      const response = await saveRouteDraft({
        id: draftId,
        milestones: nextMilestones,
      });

      if (!response.ok) {
        toast.error("Could not save milestone content.");
        return;
      }

      toast.success("Milestone content saved.");
    } catch (error) {
      console.error("Save milestone content failed:", error);
      toast.error("Could not save milestone content.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
                <label className="text-sm font-medium">Title</label>
                <Input
                  name={`title-${milestone.id}`}
                  defaultValue={milestone.title}
                  placeholder={`Milestone ${String.fromCharCode(65 + index)} title`}
                />
              </div>

              <div className="flex flex-1 flex-col gap-1">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  className="min-h-32 flex-1"
                  name={`description-${milestone.id}`}
                  defaultValue={milestone.description}
                  placeholder="Write the message users will see when they reach this milestone."
                />
              </div>
            </div>

            <div className="flex h-full flex-col gap-2">
              <label className="text-sm font-medium">Milestone image</label>
              <label
                htmlFor={`imageFile-${milestone.id}`}
                className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-background p-6 text-center hover:bg-muted/50"
              >
                {imagePreviewUrlsByMilestoneId[milestone.id] ? (
                  <img
                    src={imagePreviewUrlsByMilestoneId[milestone.id]}
                    alt={`Preview for milestone ${String.fromCharCode(65 + index)}`}
                    className="max-h-48 w-full rounded-md object-cover"
                  />
                ) : (
                  <>
                    <span className="font-medium">Choose an image</span>
                    <span className="mt-1 text-sm text-muted-foreground">
                      PNG or JPG. Upload happens when you save.
                    </span>
                  </>
                )}
              </label>
              <Input
                id={`imageFile-${milestone.id}`}
                name={`imageFile-${milestone.id}`}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) =>
                  handleMilestoneImageChange(
                    milestone.id,
                    event.target.files?.[0],
                  )
                }
              />
            </div>
          </div>
        </div>
      ))}
      <Button type="submit" disabled={isSaving}>
        {isSaving ? "Saving milestone content..." : "Save milestone content"}
      </Button>
    </form>
  );
}
