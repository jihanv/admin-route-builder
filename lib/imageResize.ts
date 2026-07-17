export const MAX_MILESTONE_IMAGE_DIMENSION = 1600;
export const MILESTONE_IMAGE_QUALITY = 0.82;

export function getMilestoneImageResizeDimensions(
  originalWidth: number,
  originalHeight: number,
) {
  const scale = Math.min(
    1,
    MAX_MILESTONE_IMAGE_DIMENSION / Math.max(originalWidth, originalHeight),
  );

  return {
    width: Math.round(originalWidth * scale),
    height: Math.round(originalHeight * scale),
  };
}

export async function getMilestoneImageDimensions(imageFile: File) {
  const imageBitmap = await createImageBitmap(imageFile);
  const dimensions = {
    width: imageBitmap.width,
    height: imageBitmap.height,
  };
  imageBitmap.close();
  return dimensions;
}

function createMilestoneImageBlob(
  canvas: HTMLCanvasElement,
  imageType: string,
) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Could not resize milestone image."));
          return;
        }

        resolve(blob);
      },
      imageType,
      MILESTONE_IMAGE_QUALITY,
    );
  });
}

export async function resizeImageFile(imageFile: File) {
  const imageBitmap = await createImageBitmap(imageFile);
  const { width, height } = getMilestoneImageResizeDimensions(
    imageBitmap.width,
    imageBitmap.height,
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    imageBitmap.close();
    throw new Error("Could not resize milestone image.");
  }

  context.drawImage(imageBitmap, 0, 0, width, height);
  imageBitmap.close();

  const blob = await createMilestoneImageBlob(canvas, imageFile.type);

  return new File([blob], imageFile.name, {
    type: imageFile.type,
    lastModified: Date.now(),
  });
}
