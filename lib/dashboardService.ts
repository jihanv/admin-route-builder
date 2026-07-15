import { getActiveMissions } from "./dashboardCalculations";
import { listMissions } from "./dashboardMockRepository";

export async function getDashboardSummary(asOfDate = new Date()) {
  const missions = await listMissions();
  const activeMissions = getActiveMissions(missions, asOfDate);

  return { activeMissions };
}
