"use client";
import { useEffect, useState } from "react";
import type { HeroBannerImageAsset } from "@/types/routeTypes";

type HeroBannerImageEditorProps = {
  draftId: string;
  savedImageAsset?: HeroBannerImageAsset;
};
import { Button } from "@/components/ui/button";

export function HeroBannerImageEditor(_props: HeroBannerImageEditorProps) {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedImageFile) return;

    const objectUrl = URL.createObjectURL(selectedImageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImageFile]);
  return (
    <div className="space-y-2">
      <label
        htmlFor="hero-banner-image"
        className="block text-base font-medium"
      >
        Hero banner image
      </label>
      <div className="grid gap-4 rounded-lg border border-dashed bg-muted/30 p-4 md:grid-cols-[1fr_18rem]">
        <div className="space-y-3">
          <div>
            <p className="font-medium">Upload a wide mission image</p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, or WebP. Maximum 5 MB.
            </p>
          </div>

          <Button asChild size="lg">
            <label htmlFor="hero-banner-image" className="cursor-pointer">
              Choose file
            </label>
          </Button>

          <input
            id="hero-banner-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) =>
              setSelectedImageFile(event.target.files?.[0] ?? null)
            }
          />

          {selectedImageFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedImageFile.name}
            </p>
          )}
        </div>
        <div className="flex min-h-36 overflow-hidden rounded-md border bg-background">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Selected hero banner preview"
              className="h-36 w-full object-cover"
            />
          ) : (
            <p className="m-auto text-sm text-muted-foreground">
              Image preview
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
