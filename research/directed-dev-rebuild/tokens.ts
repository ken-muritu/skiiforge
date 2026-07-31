// Plain constants module (no "use client") — safe to import from both
// server and client components. Lives separately from theme.ts so server
// components can read BRAND without crossing a client boundary.
export const BRAND = {
  ink: "#1E1E1E",
  green: "#6B8065",
  greenDeep: "#395241",
  slate: "#717887",
  slateBlue: "#5A6A7A",
  borderGrey: "#E1E1E1",
  cardBorder: "#D3D1D1",
  stepBorder: "#A09D9D",
  neutralBg: "#F5F5F5",
  greenTint: "#F1F4F0",
  divider: "#949494",
  gridLine: "#E6E6E6",
};
