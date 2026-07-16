import "server-only";

import { cloudinary } from "@/lib/cloudinary";

export async function deleteMilestoneImageAsset(cloudinaryPublicId: string) {
  const result = await cloudinary.uploader.destroy(cloudinaryPublicId, {
    resource_type: "image",
    invalidate: true,
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Cloudinary deletion failed: ${result.result}`);
  }

  return result.result;
}
