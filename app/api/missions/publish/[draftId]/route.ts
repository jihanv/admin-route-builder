import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getRouteDraft } from "@/lib/getRouteDraft";
import { isRouteDraftOwner } from "@/lib/isRouteDraftOwner";
import { validateDraftForPublish } from "@/lib/validateDraftForPublish";
import { createMissionFromDraft } from "@/lib/createMissionFromDraft";

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

  try {
    validateDraftForPublish(draft);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid draft",
      },
      { status: 400 },
    );
  }

  const mission = createMissionFromDraft(draftId, draft);

  return NextResponse.json({
    mission,
  });
}
