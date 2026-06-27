import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";
import { z } from "zod";
import { routePointSchema } from "@/lib/routeDraftSchemas";

const routeDraftRequestSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  goalDistanceMeters: z.number().optional(),
  snapToRoads: z.boolean().optional(),
  routePoints: z.array(routePointSchema).optional(),
});

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

export async function POST(request: Request) {
  const { isAuthenticated, userId, sessionClaims } = await auth();

  if (!isAuthenticated || !userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

  if (role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const parseResult = routeDraftRequestSchema.safeParse(await request.json());

  if (!parseResult.success)
    return NextResponse.json({ error: "Invalid route draft" }, { status: 400 });

  const now = new Date().toISOString();

  const draftRef = await adminDb.collection("routeDrafts").add({
    title: parseResult.data.title ?? "Untitled Route",
    description: parseResult.data.description ?? "",
    startDate: parseResult.data.startDate ?? "",
    goalDistanceMeters: parseResult.data.goalDistanceMeters ?? 0,
    snapToRoads: parseResult.data.snapToRoads === true,
    routePoints: parseResult.data.routePoints ?? [],
    milestones: [],
    createdByAdminId: userId,
    createdAt: now,
    updatedAt: now,
    status: "draft",
  });

  return NextResponse.json({ id: draftRef.id });
}
