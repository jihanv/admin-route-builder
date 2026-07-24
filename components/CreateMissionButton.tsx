"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
type CreateMissionButtonProps = {
  draftId: string;
};
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CreateMissionButton({ draftId }: CreateMissionButtonProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleCreateMission() {
    setErrorMessage(null);
    setIsPublishing(true);
    let response: Response;

    try {
      response = await fetch(`/api/missions/publish/${draftId}`, {
        method: "POST",
      });
    } catch {
      setErrorMessage("Could not connect. Please check your connection.");
      setIsPublishing(false);
      return;
    }

    if (response.ok) {
      setIsPublished(true);
      setIsDialogOpen(true);
      setIsPublishing(false);
      return;
    }

    setErrorMessage("Failed to create the mission. Please try again.");
    setIsPublishing(false);
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mission created</DialogTitle>
          <DialogDescription>
            Your new mission was created successfully.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Not now
          </Button>

          <Button asChild>
            <Link href={`/dashboard/missions/${draftId}`}>View mission</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
