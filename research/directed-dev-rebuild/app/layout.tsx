import type { Metadata } from "next";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../theme";
import { fontVars } from "../fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "DirectEd Development",
  description:
    "Empowering Africa's Next Generation of Tech Leaders. World-class training and remote paid internships with US and European companies.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon-32.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVars}>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
