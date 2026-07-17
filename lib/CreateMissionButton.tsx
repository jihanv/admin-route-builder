"use client";

import { Button } from "@/components/ui/button";

type CreateMissionButtonProps = {
  draftId: string;
};

export function CreateMissionButton({
  draftId: _draftId,
}: CreateMissionButtonProps) {
  return <Button type="button">Create Mission</Button>;
}
