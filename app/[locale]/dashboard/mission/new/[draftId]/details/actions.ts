"use server";

export async function updateMissionDetailsAction(
  draftId: string,
  formData: FormData,
) {
  console.log("Updating mission draft:", draftId, formData.get("title"));
}
