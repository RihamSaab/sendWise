const theme = {
  colors: {
    primary: "#244B3B",
    primaryHover: "#1B3B2E",
    primarySoft: "#DDE9DF",
    background: "#F7F6F0",
    surface: "#FFFFFF",
    surfaceMuted: "#FBFAF4",
    text: "#1F2420",
    textSecondary: "#5B6058",
    textMuted: "#8A8E85",
    textSubtle: "#B5B8AF",
    textOnPrimary: "#FFFFFF",
    border: "#ECEBE3",
    borderStrong: "#D8D5C7",
    borderSoft: "#F0EEE6",
    sage: "#DDE9DF",
    amber: "#C48A4A",
    amberSoft: "#F3E4D1",
    success: "#2F7A4F",
    error: "#B04545",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "72px",
    "4xl": "112px",
  },

  radius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    xl: "22px",
    pill: "999px",
  },

  stroke: "1px",

  elevation: {
    low: "0 1px 2px rgb(36 75 59 / 4%)",
    medium: "0 4px 14px rgb(36 75 59 / 7%)",
    high: "0 18px 48px rgb(36 75 59 / 10%)",
  },

  gradient: {
    surface: "linear-gradient(180deg, #ffffff 0%, #fcfbf7 100%)",
    surfaceMuted: "linear-gradient(180deg, #fbfaf4 0%, #f7f6f0 100%)",
    primary:
      "linear-gradient(180deg, #2d5a47 0%, #244b3b 55%, #1b3b2e 100%)",
    primaryHover:
      "linear-gradient(180deg, #244b3b 0%, #1b3b2e 55%, #142e23 100%)",
    amber: "linear-gradient(180deg, #d19a5a 0%, #c48a4a 100%)",
  },

  specular: {
    top: "inset 0 1px 0 rgb(255 255 255 / 60%)",
    topDark: "inset 0 1px 0 rgb(255 255 255 / 14%)",
    inner: "inset 0 0 0 1px rgb(255 255 255 / 40%)",
  },

  ease: {
    smooth: "cubic-bezier(0.22, 0.61, 0.36, 1)",
    silk: "cubic-bezier(0.19, 1, 0.22, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },

  duration: {
    fast: "160ms",
    base: "240ms",
    slow: "420ms",
  },

  font: {
    sans: "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif",
    mono: "var(--font-geist-mono), ui-monospace, Menlo, monospace",
  },
};

export default theme;
