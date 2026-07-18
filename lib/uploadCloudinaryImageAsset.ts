import "server-only";

export type CloudinaryImageUploadOptions = {
  buffer: Buffer;
  folder: string;
  tags: string[];
};

export type CloudinaryImageUploadResult = {
  imageUrl: string;
  cloudinaryPublicId: string;
};
