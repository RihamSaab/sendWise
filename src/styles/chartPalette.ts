import theme from "./theme";

export const chartPalette = {
  income: theme.colors.primary,
  expense: theme.colors.amber,
  categories: [
    theme.colors.primary,
    "#4A7A5F",
    theme.colors.amber,
    "#8CA996",
    theme.colors.borderStrong,
  ] as const,
  grid: theme.colors.border,
  axis: theme.colors.textMuted,
  tooltipBg: theme.colors.surface,
  tooltipBorder: theme.colors.border,
  tooltipShadow: theme.elevation.medium,
  cursor: "rgba(36, 75, 59, 0.06)",
};
