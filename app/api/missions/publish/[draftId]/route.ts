import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getRouteDraft } from "@/lib/getRouteDraft";
import { isRouteDraftOwner } from "@/lib/isRouteDraftOwner";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ draftId: string }> },
) {
  const { draftId } = await params;

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const draft = await getRouteDraft(draftId);

  if (!draft) {
    return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  }

  if (!isRouteDraftOwner(draft, userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    message: "Authenticated",
    userId,
    draftId,
  });
}
