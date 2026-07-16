import "server-only";

import { deleteRouteDraftImages } from "@/lib/deleteRouteDraftImages";
import { adminDb } from "@/lib/firebaseAdmin";

const EXPIRED_DRAFT_LIMIT = 25;

export async function deleteExpiredRouteDrafts() {
  const expiredDrafts = await adminDb
    .collection("routeDrafts")
    .where("expiresAt", "<=", new Date())
    .orderBy("expiresAt", "asc")
    .limit(EXPIRED_DRAFT_LIMIT)
    .get();

  let deletedCount = 0;

  for (const draft of expiredDrafts.docs) {
    try {
      await deleteRouteDraftImages(draft.id);
      await draft.ref.delete();
      deletedCount += 1;
    } catch (error) {
      console.error(`Failed to clean expired draft ${draft.id}`, error);
    }
  }

  return {
    checkedCount: expiredDrafts.size,
    deletedCount,
  };
}
