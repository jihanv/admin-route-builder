"use client";
import { useState } from "react";
import type { HeroBannerImageAsset } from "@/types/routeTypes";

type HeroBannerImageEditorProps = {
  draftId: string;
  savedImageAsset?: HeroBannerImageAsset;
};

export function HeroBannerImageEditor(_props: HeroBannerImageEditorProps) {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  return (
    <div className="space-y-2">
      <label
        htmlFor="hero-banner-image"
        className="block text-base font-medium"
      >
        Hero banner image
      </label>
      <input
        id="hero-banner-image"
        type="file"
        accept="image/jpeg,image/png,image/webp"
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
  );
}
