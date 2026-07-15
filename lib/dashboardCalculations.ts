type CheckoutSession = {
  amount_total: number | null;
  customer: string | null;
  payment_status: string;
  status: string;
};

type ActiveMissionInput = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
};

type Refund = { amount: number; status: string };

function isSuccessfulDonationSession(session: CheckoutSession) {
  return session.payment_status === "paid" && session.status === "complete";
}

export function calculateTotalDonationsCents(
  sessions: CheckoutSession[],
  refunds: Refund[],
) {
  const paid = sessions
    .filter(isSuccessfulDonationSession)
    .reduce((sum, s) => sum + (s.amount_total ?? 0), 0);
  const refunded = refunds
    .filter((r) => r.status === "succeeded")
    .reduce((sum, r) => sum + r.amount, 0);
  return paid - refunded;
}

export function calculateTotalDonors(sessions: CheckoutSession[]) {
  const customerIds = sessions
    .filter(isSuccessfulDonationSession)
    .map((s) => s.customer)
    .filter((id): id is string => id !== null);
  return new Set(customerIds).size;
}

export function calculateAverageDonationCents(
  sessions: CheckoutSession[],
  refunds: Refund[],
) {
  const successfulSessions = sessions.filter(isSuccessfulDonationSession);
  if (successfulSessions.length === 0) return 0;

  return Math.round(
    calculateTotalDonationsCents(sessions, refunds) / successfulSessions.length,
  );
}

export function getActiveMissions(
  missions: ActiveMissionInput[],
  asOfDate: Date,
) {
  return missions.filter((mission) => {
    const startDate = new Date(mission.startDate);
    const endDate = new Date(mission.endDate);

    return (
      mission.status === "published" &&
      startDate <= asOfDate &&
      asOfDate <= endDate
    );
  });
}
