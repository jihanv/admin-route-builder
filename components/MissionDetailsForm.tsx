"use client";

import type { ComponentProps } from "react";

type MissionDetailsFormProps = ComponentProps<"form"> & {
  draftId: string;
};

export function MissionDetailsForm({
  draftId,
  ...formProps
}: MissionDetailsFormProps) {
  return <form {...formProps} data-draft-id={draftId} />;
}
