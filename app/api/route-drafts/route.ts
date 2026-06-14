import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

export async function GET() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ ok: true, userId });
}
