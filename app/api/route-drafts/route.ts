import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";

const routePointSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const routeDraftRequestSchema = z.object({
  title: z.string().optional(),
  routePoints: z.array(routePointSchema).optional(),
});

function isRoutePointArray(value: unknown) {
  return (
    Array.isArray(value) &&
    value.every(
      (point) =>
        typeof point === "object" &&
        point !== null &&
        typeof (point as { latitude?: unknown }).latitude === "number" &&
        typeof (point as { longitude?: unknown }).longitude === "number",
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
