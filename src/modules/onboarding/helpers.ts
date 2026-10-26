export function formatAmount(amount: number | string, currency: string) {
  const value = Number(amount);

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export function formatDate(date: string | null) {
  if (!date) {
    return "Not set";
  }

  const parsedDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

export function formatFrequency(frequency: string) {
  const labels: Record<string, string> = {
    weekly: "Weekly",
    monthly: "Monthly",
    yearly: "Yearly",
    one_time: "One-time",
  };

  return labels[frequency] ?? frequency;
}

export function formatBasis(basis: string) {
  return basis === "current_savings" ? "Current savings" : "Income";
}
