"use client";

import type { HeroBannerImageAsset } from "@/types/routeTypes";

type HeroBannerImageEditorProps = {
  draftId: string;
  savedImageAsset?: HeroBannerImageAsset;
};

export function HeroBannerImageEditor({
  draftId,
  savedImageAsset,
}: HeroBannerImageEditorProps) {
  return (
    <p className="text-sm text-muted-foreground">
      Hero banner for draft {draftId}: {savedImageAsset ? "Saved" : "Not added"}
    </p>
  );
}
