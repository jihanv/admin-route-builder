import {
  calculateAverageDonationCents,
  calculateTotalDonationsCents,
  calculateTotalDonors,
  getActiveMissions,
} from "./dashboardCalculations";
import {
  listMissions,
  listStripeCheckoutSessions,
  listStripeRefunds,
} from "./dashboardMockRepository";

export async function getDashboardSummary(asOfDate = new Date()) {
  const [missions, checkoutSessionsList, refunds] = await Promise.all([
    listMissions(),
    listStripeCheckoutSessions(),
    listStripeRefunds(),
  ]);

  const sessions = checkoutSessionsList.data;
  const activeMissions = getActiveMissions(missions, asOfDate);
  const totalDonationsCents = calculateTotalDonationsCents(sessions, refunds);
  const totalDonors = calculateTotalDonors(sessions);
  const averageDonationCents = calculateAverageDonationCents(sessions, refunds);

  return {
    activeMissions,
    totalDonationsCents,
    totalDonors,
    averageDonationCents,
  };
}
