import { auth } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const { sessionClaims } = await auth();
  const adminRole =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

  if (adminRole !== "admin") {
    return NextResponse.json(
      { ok: false, error: "Access denied" },
      { status: 403 },
    );
  }

  if (!process.env.CLOUDINARY_URL) {
    return NextResponse.json(
      { ok: false, error: "Missing CLOUDINARY_URL" },
      { status: 500 },
    );
  }

  try {
    await cloudinary.api.resources({ max_results: 1 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Cloudinary health check failed:", error);
    return NextResponse.json(
      { ok: false, error: "Cloudinary connection failed" },
      { status: 500 },
    );
  }
}
