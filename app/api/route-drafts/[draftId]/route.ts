import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { routePointSchema } from "@/lib/routeDraftSchemas";
import { adminDb } from "@/lib/firebaseAdmin";

const routeDraftPatchSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  goalDistanceMeters: z.number().optional(),
  routePoints: z.array(routePointSchema).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ draftId: string }> },
) {
  const { isAuthenticated, sessionClaims } = await auth();

  if (!isAuthenticated)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role =
    (sessionClaims?.metadata as { role?: string } | undefined)?.role ?? null;

  if (role !== "admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { draftId } = await params;
  const parseResult = routeDraftPatchSchema.safeParse(await request.json());

  if (!parseResult.success)
    return NextResponse.json({ error: "Invalid route draft" }, { status: 400 });

  const draftRef = adminDb.collection("routeDrafts").doc(draftId);
  const draftSnapshot = await draftRef.get();

  if (!draftSnapshot.exists)
    return NextResponse.json(
      { error: "Route draft not found" },
      { status: 404 },
    );

  await draftRef.update({
    ...parseResult.data,
    updatedAt: new Date().toISOString(),
  });

  return NextResponse.json({ id: draftId });
}
