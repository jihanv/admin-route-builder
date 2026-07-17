"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
type CreateMissionButtonProps = {
  draftId: string;
};

export function CreateMissionButton({ draftId }: CreateMissionButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false);

  async function handleCreateMission() {
    setIsPublishing(true);

    const response = await fetch(`/api/missions/publish/${draftId}`, {
      method: "POST",
    });

    if (!response.ok) {
      console.error("Failed to publish mission");
      setIsPublishing(false);
    }
  }

  return (
    <Button disabled={isPublishing} onClick={handleCreateMission}>
      {isPublishing ? "Creating Mission..." : "Create Mission"}
    </Button>
  );
}
