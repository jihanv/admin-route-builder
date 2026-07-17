"use client";

import { Button } from "@/components/ui/button";

type CreateMissionButtonProps = {
  draftId: string;
};

export function CreateMissionButton({ draftId }: CreateMissionButtonProps) {
  async function handleCreateMission() {
    const response = await fetch(`/api/missions/publish/${draftId}`, {
      method: "POST",
    });

    if (!response.ok) {
      console.error("Failed to publish mission");
    }
  }

  return <Button onClick={handleCreateMission}>Create Mission</Button>;
}
