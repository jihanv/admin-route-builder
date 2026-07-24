"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
type CreateMissionButtonProps = {
  draftId: string;
};

export function CreateMissionButton({ draftId }: CreateMissionButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCreateMission() {
    setErrorMessage(null);
    setIsPublishing(true);

    const response = await fetch(`/api/missions/publish/${draftId}`, {
      method: "POST",
    });

    if (response.ok) {
      setIsPublished(true);
      setIsPublishing(false);
      return;
    }

    setErrorMessage("Failed to create the mission. Please try again.");
    setIsPublishing(false);
  }

  return (
    <div>
      <Button
        disabled={isPublishing || isPublished}
        onClick={handleCreateMission}
        className="w-44"
      >
        {isPublished
          ? "Mission Created"
          : isPublishing
            ? "Creating Mission..."
            : "Create Mission"}
      </Button>

      {errorMessage && (
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
}
