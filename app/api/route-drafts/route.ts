import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

function isRoutePointArray(value: unknown) {
  return (
    Array.isArray(value) &&
    value.every(
      (point) =>
        typeof point?.latitude === "number" &&
        typeof point?.longitude === "number",
    )
  );
}

export async function GET() {
  const { isAuthenticated, userId, sessionClaims } = await auth();

  if (!isAuthenticated)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

  if (role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  return NextResponse.json({ ok: true, userId, role });
}
