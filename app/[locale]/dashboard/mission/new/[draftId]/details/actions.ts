"use server";
import { z } from "zod";

const missionDetailsSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Mission title is required.")
    .max(120, "Mission title must be 120 characters or less."),
});

export async function updateMissionDetailsAction(
  draftId: string,
  formData: FormData,
) {
  const result = missionDetailsSchema.safeParse({
    title: formData.get("title"),
  });

  if (!result.success) {
    console.log(
      "Mission details validation failed:",
      z.treeifyError(result.error),
    );
    return;
  }

  console.log("Validated mission details:", draftId, result.data.title);
}
