import "server-only";
import { cloudinary } from "@/lib/cloudinary";
export type CloudinaryImageUploadOptions = {
  buffer: Buffer;
  folder: string;
  tags: string[];
};

export type CloudinaryImageUploadResult = {
  imageUrl: string;
  cloudinaryPublicId: string;
};
export async function uploadCloudinaryImageAsset(
  options: CloudinaryImageUploadOptions,
): Promise<CloudinaryImageUploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        tags: options.tags,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary returned no upload result."));
          return;
        }

        resolve({
          imageUrl: result.secure_url,
          cloudinaryPublicId: result.public_id,
        });
      },
    );

    uploadStream.end(options.buffer);
  });
}
