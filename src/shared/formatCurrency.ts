export function formatCurrency(
  amount: number | string,
  currency: string,
): string {
  const value = Number(amount);
  const safeValue = Number.isFinite(value) ? value : 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(safeValue);
}
