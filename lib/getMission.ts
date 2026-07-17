import "server-only";

import { adminDb } from "@/lib/firebaseAdmin";
import type { Mission } from "@/types/routeTypes";

export async function getMission(missionId: string): Promise<Mission | null> {
  const missionSnapshot = await adminDb
    .collection("missions")
    .doc(missionId)
    .get();

  if (!missionSnapshot.exists) {
    return null;
  }

  return {
    ...(missionSnapshot.data() as Mission),
    id: missionSnapshot.id,
  };
}
