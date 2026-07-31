import { Header } from "../components/Header";
import {
  Hero,
  Reality,
  Opportunity,
  Alternative,
  Stats,
  HowItWorks,
  Recognized,
  Collaborators,
  Testimonial,
  FinalCTA,
  Footer,
} from "../components/sections";
import Box from "@mui/material/Box";

export default function HomePage() {
  return (
    <>
      <Header />
      <Box component="main" className="relative min-h-screen w-full overflow-hidden bg-white">
        <Hero />
        <Reality />
        <Opportunity />
        <Alternative />
        <Stats />
        <HowItWorks />
        <Recognized />
        <Collaborators />
        <Testimonial />
        <FinalCTA />
      </Box>
      <Footer />
    </>
  );
}
