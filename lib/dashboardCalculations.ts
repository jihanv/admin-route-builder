type CheckoutSession = {
  amount_total: number | null;
  customer: string | null;
  payment_status: string;
  status: string;
};

type Refund = { amount: number; status: string };

export function calculateTotalDonationsCents(
  sessions: CheckoutSession[],
  refunds: Refund[],
) {
  const paid = sessions
    .filter((s) => s.payment_status === "paid" && s.status === "complete")
    .reduce((sum, s) => sum + (s.amount_total ?? 0), 0);
  const refunded = refunds
    .filter((r) => r.status === "succeeded")
    .reduce((sum, r) => sum + r.amount, 0);
  return paid - refunded;
}

export function calculateTotalDonors(sessions: CheckoutSession[]) {
  const customerIds = sessions
    .filter((s) => s.payment_status === "paid" && s.status === "complete")
    .map((s) => s.customer)
    .filter((id): id is string => id !== null);
  return new Set(customerIds).size;
}
