type CheckoutSession = {
  amount_total: number | null;
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
