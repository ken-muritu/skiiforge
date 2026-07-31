"use client";

import { createTheme } from "@mui/material/styles";
import { BRAND } from "./tokens";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: BRAND.greenDeep }, // real brand primary (#395241), not MUI default blue
    text: { primary: BRAND.ink, secondary: BRAND.slate },
    background: { default: "#FFFFFF", paper: "#FFFFFF" },
  },
  typography: {
    fontFamily: "var(--font-inter), Roboto, Helvetica, Arial, sans-serif",
    h1: { fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 700 },
    h2: { fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 700 },
    h3: { fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 600 },
    h4: { fontFamily: "var(--font-plus-jakarta), sans-serif", fontWeight: 600 },
    body1: { fontFamily: "var(--font-dm-sans), sans-serif" },
    body2: { fontFamily: "var(--font-dm-sans), sans-serif" },
  },
  shape: { borderRadius: 5 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: BRAND.ink,
          boxShadow:
            "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
        },
      },
    },
  },
});

export default theme;
export { BRAND };
