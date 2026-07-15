export function formatCurrencyFromCents(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

export function dollarsToCents(dollars: string): number {
  return Math.round(Number(dollars) * 100);
}
