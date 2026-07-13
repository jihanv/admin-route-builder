import stripeData from "@/data/stripeMockData.json";
import missions from "@/data/mockMissions.json";

export async function listStripeCustomers() {
  return stripeData.stripeCustomers;
}
export async function listStripeCheckoutSessions(limit = 100) {
  const data = stripeData.stripeCheckoutSessions.slice(0, limit);
  return {
    object: "list" as const,
    data,
    has_more: data.length < stripeData.stripeCheckoutSessions.length,
  };
}
export async function listStripeRefunds() {
  return stripeData.stripeRefunds;
}
export async function listMissions() {
  return missions;
}

export async function listActiveMissions(asOfDate: string) {
  return missions.filter(
    (mission) =>
      mission.status === "published" &&
      mission.startDate <= asOfDate &&
      mission.endDate >= asOfDate,
  );
}
