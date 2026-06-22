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
  console.log("Updating mission draft:", draftId, formData.get("title"));
}
