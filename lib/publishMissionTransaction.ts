import "server-only";

import { adminDb } from "@/lib/firebaseAdmin";
import type { Mission } from "@/types/routeTypes";

export async function publishMissionTransaction(mission: Mission) {
  const missionRef = adminDb.collection("missions").doc(mission.id);

  const draftRef = adminDb.collection("routeDrafts").doc(mission.id);

  await adminDb.runTransaction(async (transaction) => {
    transaction.set(missionRef, mission);
    transaction.delete(draftRef);
  });
}
