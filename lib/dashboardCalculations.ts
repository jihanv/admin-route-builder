type CheckoutSession = {
  amount_total: number | null;
  created: number;
  customer: string | null;
  metadata: { missionId?: string };
  payment_intent: string | null;
  payment_status: string;
  status: string;
};
type ActiveMissionInput = {
  id: string;
  title: string;
  fundraisingGoalCents: number;
  startDate: string;
  endDate: string;
  status: string;
};

type Refund = {
  amount: number;
  created: number;
  payment_intent: string | null;
  status: string;
};

function isSuccessfulDonationSession(session: CheckoutSession) {
  return session.payment_status === "paid" && session.status === "complete";
}

export function calculateTotalDonationsCents(
  sessions: CheckoutSession[],
  refunds: Refund[],
) {
  const successfulSessions = sessions.filter(isSuccessfulDonationSession);

  const paymentIntentIds = new Set(
    successfulSessions
      .map((session) => session.payment_intent)
      .filter((id): id is string => id !== null),
  );

  const paid = successfulSessions.reduce(
    (sum, session) => sum + (session.amount_total ?? 0),
    0,
  );

  const refunded = refunds
    .filter(
      (refund) =>
        refund.status === "succeeded" &&
        refund.payment_intent !== null &&
        paymentIntentIds.has(refund.payment_intent),
    )
    .reduce((sum, refund) => sum + refund.amount, 0);

  return paid - refunded;
}

export function calculateMissionDonationsCents(
  missionId: string,
  sessions: CheckoutSession[],
  refunds: Refund[],
) {
  const missionSessions = sessions.filter(
    (session) => session.metadata.missionId === missionId,
  );
  return calculateTotalDonationsCents(missionSessions, refunds);
}

export type DonationTrendPoint = {
  created: number;
  totalCents: number;
};

export function calculateDonationTrend(
  sessions: CheckoutSession[],
  refunds: Refund[],
): DonationTrendPoint[] {
  const successfulSessions = sessions.filter(isSuccessfulDonationSession);

  const refundedByPaymentIntent = new Map<string, number>();

  refunds
    .filter(
      (refund) =>
        refund.status === "succeeded" && refund.payment_intent !== null,
    )
    .forEach((refund) => {
      const refundedSoFar =
        refundedByPaymentIntent.get(refund.payment_intent!) ?? 0;

      refundedByPaymentIntent.set(
        refund.payment_intent!,
        refundedSoFar + refund.amount,
      );
    });

  const events = successfulSessions
    .map((session) => {
      const refundedCents =
        session.payment_intent === null
          ? 0
          : (refundedByPaymentIntent.get(session.payment_intent) ?? 0);

      return {
        created: session.created,
        changeCents: Math.max(0, (session.amount_total ?? 0) - refundedCents),
      };
    })
    .filter((event) => event.changeCents > 0)
    .sort((first, second) => first.created - second.created);

  let totalCents = 0;

  return events.map((event) => {
    totalCents += event.changeCents;

    return {
      created: event.created,
      totalCents,
    };
  });
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
): ActiveMissionInput[] {
  return missions
    .filter((mission) => {
      const startDate = new Date(mission.startDate);
      const endDate = new Date(mission.endDate);

      return (
        mission.status === "published" &&
        startDate <= asOfDate &&
        asOfDate <= endDate
      );
    })
    .sort(
      (firstMission, secondMission) =>
        new Date(firstMission.endDate).getTime() -
        new Date(secondMission.endDate).getTime(),
    );
}

export function calculateFundraisingPercentage(
  amountRaisedCents: number,
  fundraisingGoalCents: number,
) {
  if (fundraisingGoalCents <= 0) return 0;

  return Math.round((amountRaisedCents / fundraisingGoalCents) * 100);
}
