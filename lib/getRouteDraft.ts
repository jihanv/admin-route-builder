import "server-only";

import { adminDb } from "@/lib/firebaseAdmin";
import type { RouteDraft } from "@/types/routeTypes";

export async function getRouteDraft(
  draftId: string,
): Promise<RouteDraft | null> {
  const draftSnapshot = await adminDb
    .collection("routeDrafts")
    .doc(draftId)
    .get();

  if (!draftSnapshot.exists) {
    return null;
  }

  return {
    id: draftSnapshot.id,
    ...(draftSnapshot.data() as RouteDraft),
  };
}
