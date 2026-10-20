// Prices are shown as bare numbers (no symbol, no conversion).
export function formatAmount(amount: number): string {
  return amount.toFixed(2);
}
