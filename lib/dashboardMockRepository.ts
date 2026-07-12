import stripeData from "@/data/stripeMockData.json";
import missions from "@/data/mockMissions.json";

export async function listStripeCustomers() {
  return stripeData.stripeCustomers;
}
export async function listStripeCheckoutSessions() {
  return stripeData.stripeCheckoutSessions;
}
export async function listStripeRefunds() {
  return stripeData.stripeRefunds;
}
export async function listMissions() {
  return missions;
}
