import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { isAuthenticated, userId } = await auth();

  if (!isAuthenticated)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ ok: true, userId });
}
