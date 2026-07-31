import { Header } from "../../components/Header";
import { Footer } from "../../components/sections";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BRAND } from "../../tokens";

export const metadata = {
  title: "About Us · DirectEd Development",
};

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <Box component="main" className="bg-white" sx={{ px: { xs: 4, md: "120px" }, py: "120px", maxWidth: 900 }}>
        <Typography variant="h1" sx={{ fontSize: { xs: 36, md: 64 }, fontWeight: 700, color: BRAND.ink }}>
          About Us
        </Typography>
        <Typography sx={{ mt: 3, fontSize: 18, color: BRAND.slate, lineHeight: 1.7 }}>
          DirectEd Development empowers Africa&apos;s next generation of tech
          leaders through world-class training and remote, paid internships with
          US and European companies. This is a reconstruction stub — the live
          /about-us route was not captured in the forensic analysis. Expand this
          page with the organization&apos;s story, team, and mission.
        </Typography>
      </Box>
      <Footer />
    </>
  );
}
