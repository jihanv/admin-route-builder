import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { uploadCloudinaryImageAsset } from "@/lib/uploadCloudinaryImageAsset";
import { adminDb } from "@/lib/firebaseAdmin";
import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_FILE_SIZE_BYTES,
} from "@/lib/imageUploadLimits";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ draftId: string }> },
) {
  const { draftId } = await params;
  const { sessionClaims, userId } = await auth();
  const adminRole =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

  if (adminRole !== "admin") {
    return NextResponse.json({ error: "Access denied" }, { status: 403 });
  }

  const draftSnapshot = await adminDb
    .collection("routeDrafts")
    .doc(draftId)
    .get();

  if (
    !draftSnapshot.exists ||
    draftSnapshot.data()?.createdByAdminId !== userId
  ) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  }

  const formData = await request.formData();
  const imageFile = formData.get("imageFile");

  if (!(imageFile instanceof File)) {
    return NextResponse.json({ error: "Missing image file" }, { status: 400 });
  }

  if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
    return NextResponse.json(
      { error: "File must be a PNG, JPG, or WebP image" },
      { status: 400 },
    );
  }

  if (imageFile.size > MAX_IMAGE_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Image must be smaller than 5 MB" },
      { status: 400 },
    );
  }
  //Reads the file’s contents and gives us its raw binary bytes in an ArrayBuffer
  const arrayBuffer = await imageFile.arrayBuffer();

  // Takes the same raw image bytes and creates a Node.js Buffer
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await uploadCloudinaryImageAsset({
    buffer,
    folder: `rei-mission-drafts/${draftId}/hero-banner`,
    tags: [`rei-route-draft-${draftId}`],
  });

  return NextResponse.json({
    ok: true,
    imageUrl: uploadResult.imageUrl,
    publicId: uploadResult.cloudinaryPublicId,
  });
}
