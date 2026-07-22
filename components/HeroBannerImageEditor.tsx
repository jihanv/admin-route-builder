"use client";
import { useEffect, useState } from "react";
import type { HeroBannerImageAsset } from "@/types/routeTypes";

import { Button } from "@/components/ui/button";
import Image from "next/image";
type HeroBannerImageEditorProps = {
  savedImageAsset?: HeroBannerImageAsset;
  onImageSelected: (imageFile: File | null) => void;
};

export function HeroBannerImageEditor({
  savedImageAsset,
  onImageSelected,
}: HeroBannerImageEditorProps) {
  const [selectedImageName, setSelectedImageName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    savedImageAsset?.imageUrl ?? null,
  );

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleHeroBannerImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const imageFile = event.target.files?.[0] ?? null;

    setSelectedImageName(imageFile?.name ?? "");
    setPreviewUrl(imageFile ? URL.createObjectURL(imageFile) : null);
    onImageSelected(imageFile);
  };

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
            onChange={handleHeroBannerImageChange}
          />

          {selectedImageName && (
            <p className="text-sm text-muted-foreground">
              Selected: {selectedImageName}
            </p>
          )}
        </div>
        <div className="relative flex h-36 overflow-hidden rounded-md border bg-background">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Selected hero banner preview"
              fill
              sizes="(min-width: 768px) 18rem, 100vw"
              className="object-cover"
              unoptimized
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
