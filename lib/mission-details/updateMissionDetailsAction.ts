"use server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { dollarsToCents } from "@/lib/formatters";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_FILE_SIZE_BYTES,
} from "@/lib/imageUploadLimits";
import { heroBannerImageAssetSchema } from "@/lib/routeDraftSchemas";
import { fileToBuffer } from "@/lib/fileToBuffer";
import { uploadCloudinaryImageAsset } from "@/lib/uploadCloudinaryImageAsset";
import { deleteCloudinaryImageAsset } from "@/lib/deleteCloudinaryImageAsset";

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
    fundraisingGoalDollars: z
      .string()
      .trim()
      .regex(
        /^\d+(\.\d{1,2})?$/,
        "Fundraising goal must have no more than two decimal places.",
      )
      .refine((value) => Number(value) > 0, {
        message: "Fundraising goal must be greater than zero.",
      }),
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

  const currentHeroBannerResult = heroBannerImageAssetSchema.safeParse(
    draft?.heroBannerImageAsset,
  );

  const currentHeroBannerImageAsset = currentHeroBannerResult.success
    ? currentHeroBannerResult.data
    : null;

  const heroBannerImageFile = formData.get("heroBannerImageFile");

  if (heroBannerImageFile !== null && !(heroBannerImageFile instanceof File)) {
    console.log("Hero banner image must be a file.");
    redirect(
      `/dashboard/missions/new/${draftIdResult.data}/details?error=image`,
    );
  }

  const newHeroBannerImageFile =
    heroBannerImageFile instanceof File ? heroBannerImageFile : null;

  if (
    newHeroBannerImageFile &&
    !ALLOWED_IMAGE_TYPES.includes(newHeroBannerImageFile.type)
  ) {
    console.log("Unsupported hero banner image type.");
    redirect(
      `/dashboard/missions/new/${draftIdResult.data}/details?error=image`,
    );
  }

  if (
    newHeroBannerImageFile &&
    newHeroBannerImageFile.size > MAX_IMAGE_FILE_SIZE_BYTES
  ) {
    console.log("Hero banner image exceeds the file-size limit.");
    redirect(
      `/dashboard/missions/new/${draftIdResult.data}/details?error=image`,
    );
  }

  const result = missionDetailsSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? "",
    fundraisingGoalDollars: formData.get("fundraisingGoalDollars"),
    startDate: formData.get("startDate") ?? "",
    endDate: formData.get("endDate") ?? "",
  });

  if (!result.success) {
    console.log(
      "Mission details validation failed:",
      z.treeifyError(result.error),
    );
    redirect(
      `/dashboard/missions/new/${draftIdResult.data}/details?error=validation`,
    );
  }

  const fundraisingGoalDollars = result.data.fundraisingGoalDollars;
  const fundraisingGoalCents = dollarsToCents(fundraisingGoalDollars);

  const missionDetailsUpdates = {
    title: result.data.title,
    description: result.data.description,
    fundraisingGoalCents,
    startDate: result.data.startDate,
    endDate: result.data.endDate,
    updatedAt: new Date().toISOString(),
    detailsSavedAt: new Date().toISOString(),
  };

  if (!newHeroBannerImageFile) {
    await draftRef.update(missionDetailsUpdates);
  } else {
    try {
      const buffer = await fileToBuffer(newHeroBannerImageFile);

      const uploadedHeroBannerImageAsset = await uploadCloudinaryImageAsset({
        buffer,
        folder: `rei-mission-drafts/${draftIdResult.data}/hero-banner`,
        tags: [`rei-route-draft-${draftIdResult.data}`],
      });

      try {
        if (
          process.env.NODE_ENV === "development" &&
          process.env.TEST_HERO_BANNER_FIRESTORE_FAILURE === "true"
        ) {
          throw new Error("Simulated hero banner Firestore failure.");
        }
        await draftRef.update({
          ...missionDetailsUpdates,
          heroBannerImageAsset: uploadedHeroBannerImageAsset,
        });
      } catch (error) {
        try {
          await deleteCloudinaryImageAsset(
            uploadedHeroBannerImageAsset.cloudinaryPublicId,
          );
          console.log(
            "Deleted unsaved hero banner image:",
            uploadedHeroBannerImageAsset.cloudinaryPublicId,
          );
        } catch (cleanupError) {
          console.error(
            "Failed to delete the unsaved new hero banner image.",
            cleanupError,
          );
        }

        throw error;
      }

      if (
        currentHeroBannerImageAsset &&
        currentHeroBannerImageAsset.cloudinaryPublicId !==
          uploadedHeroBannerImageAsset.cloudinaryPublicId
      ) {
        try {
          await deleteCloudinaryImageAsset(
            currentHeroBannerImageAsset.cloudinaryPublicId,
          );
        } catch (error) {
          console.error(
            "Failed to delete the replaced hero banner image.",
            error,
          );
        }
      }
    } catch (error) {
      console.error("Failed to save the new hero banner image.", error);
      redirect(
        `/dashboard/missions/new/${draftIdResult.data}/details?error=image`,
      );
    }
  }

  revalidatePath(`/dashboard/missions/new/${draftIdResult.data}/details`);

  redirect(`/dashboard/missions/new/${draftIdResult.data}/details?saved=1`);
}
