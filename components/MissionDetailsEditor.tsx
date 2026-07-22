"use client";

import type { ComponentProps } from "react";

type MissionDetailsEditorProps = ComponentProps<"form"> & {
  draftId: string;
};

export function MissionDetailsEditor({
  draftId,
  children,
  ...formProps
}: MissionDetailsEditorProps) {
  return (
    <form {...formProps} data-draft-id={draftId}>
      {children}
    </form>
  );
}
