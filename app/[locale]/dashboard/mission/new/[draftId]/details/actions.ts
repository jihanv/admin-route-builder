"use server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const missionDetailsSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Mission title is required.")
      .max(120, "Mission title must be 120 characters or less."),
    description: z
      .string()
      .trim()
      .max(1000, "Description must be 1000 characters or less."),
    startDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must use YYYY-MM-DD format.")
      .or(z.literal("")),
    endDate: z
      .string()
      .trim()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must use YYYY-MM-DD format.")
      .or(z.literal("")),
  })
  .refine(
    (data) => !data.startDate || !data.endDate || data.endDate > data.startDate,
    { message: "End date must be after start date.", path: ["endDate"] },
  );

const draftIdSchema = z.string().trim().min(1).max(128);

export async function updateMissionDetailsAction(
  draftId: string,
  formData: FormData,
) {
  const draftIdResult = draftIdSchema.safeParse(draftId);

  if (!draftIdResult.success) {
    console.log("Invalid draft id:", z.treeifyError(draftIdResult.error));
    return;
  }
  const { userId, sessionClaims } = await auth();
  const adminRole =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

  if (!userId || adminRole !== "admin") {
    console.log("Unauthorized mission details update.");
    return;
  }

  const draftRef = adminDb.collection("routeDrafts").doc(draftIdResult.data);
  const draftSnapshot = await draftRef.get();

  if (!draftSnapshot.exists) {
    console.log("Mission draft does not exist.");
    return;
  }

  const draft = draftSnapshot.data();
  if (draft?.createdByAdminId !== userId) {
    console.log("Cannot edit another admin's draft.");
    return;
  }

  const result = missionDetailsSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    startDate: formData.get("startDate") ?? "",
    endDate: formData.get("endDate") ?? "",
  });

  if (!result.success) {
    console.log(
      "Mission details validation failed:",
      z.treeifyError(result.error),
    );
    redirect(
      `/dashboard/mission/new/${draftIdResult.data}/details?error=validation`,
    );
  }

  await draftRef.update({
    title: result.data.title,
    description: result.data.description,
    startDate: result.data.startDate,
    endDate: result.data.endDate,
    updatedAt: new Date().toISOString(),
  });

  revalidatePath(`/dashboard/mission/new/${draftIdResult.data}/details`);

  redirect(`/dashboard/mission/new/${draftIdResult.data}/details?saved=1`);
}
