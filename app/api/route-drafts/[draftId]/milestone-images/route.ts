import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { adminDb } from "@/lib/firebaseAdmin";

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

  if (!imageFile.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "File must be an image" },
      { status: 400 },
    );
  }

  const maxFileSizeBytes = 5 * 1024 * 1024;

  if (imageFile.size > maxFileSizeBytes) {
    return NextResponse.json(
      { error: "Image must be smaller than 5 MB" },
      { status: 400 },
    );
  }

  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `rei-mission-drafts/${draftId}/milestones`,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result?.secure_url || !result.public_id) {
          reject(new Error("Cloudinary upload did not return an image URL."));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      },
    );

    uploadStream.end(buffer);
  });

  return NextResponse.json({
    ok: true,
    imageUrl: uploadResult.secure_url,
    publicId: uploadResult.public_id,
  });
}
