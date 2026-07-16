import "server-only";
import { cloudinary } from "@/lib/cloudinary";

export async function deleteRouteDraftImages(draftId: string) {
  const draftTag = `rei-route-draft-${draftId}`;

  return cloudinary.api.delete_resources_by_tag(draftTag, {
    resource_type: "image",
  });
}
