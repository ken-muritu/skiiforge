import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Image from "next/image";
import { Reveal } from "./Reveal";
import { BRAND } from "../tokens";

const APPLY_URL = "https://tally.so/r/2Er8jD";

/* ---------------- HERO ---------------- */
export function Hero() {
  return (
    <Box
      className="relative flex md:min-h-screen md:items-center justify-center overflow-hidden pt-[95px] md:pt-0 pb-[75px] px-4 sm:px-6 md:px-[80px] lg:px-[120px]"
      sx={{ position: "relative" }}
    >
      <Box
        className="hero-grid pointer-events-none absolute inset-0"
        sx={{ position: "absolute", inset: 0 }}
        aria-hidden
      />
      <Box className="relative z-10" sx={{ position: "relative", zIndex: 10 }}>
        <Box className="w-full text-center">
          <Typography
            variant="h1"
            className="text-balance"
            sx={{
              fontSize: { xs: 36, sm: 48, md: 96 },
              lineHeight: { md: "96px" },
              letterSpacing: "0%",
              fontWeight: 700,
              color: BRAND.ink,
            }}
          >
            <Box component="span" sx={{ color: BRAND.ink }}>
              For the ones who
            </Box>
            <br />
            <Box component="span" sx={{ color: BRAND.green }}>
              refuse average
            </Box>
            <Box component="span" sx={{ color: "#000" }}>
              .
            </Box>
          </Typography>
          <Typography
            className="text-balance"
            sx={{
              mt: "18px",
              fontSize: { xs: 16, md: 18 },
              lineHeight: "26px",
              color: BRAND.slate,
              maxWidth: 620,
              mx: "auto",
            }}
          >
            Intensive program that transforms raw talent into globally
            competitive engineers, with stipend supported internships and real
            placement support.
          </Typography>
          <Box
            className="flex flex-col gap-4 pt-6 sm:flex-row sm:justify-center sm:gap-6"
            sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3, pt: 6, justifyContent: "center" }}
          >
            <Button
              component="a"
              href={APPLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              sx={{
                backgroundColor: BRAND.greenDeep,
                color: "#fff",
                borderRadius: "5px",
                fontSize: 16,
                px: 4,
                py: 1,
                "&:hover": { backgroundColor: "#2c3f2f" },
              }}
            >
              Apply Now
            </Button>
            <Button
              href="#how-it-works"
              variant="outlined"
              sx={{
                borderColor: BRAND.ink,
                color: BRAND.ink,
                borderRadius: "5px",
                fontSize: 16,
                px: 4,
                py: 1,
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              How it works
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ---------------- THE REALITY ---------------- */
export function Reality() {
  const stats = [
    { n: "30%", l: "Graduates from top-3 universities in Kenya are unemployed" },
    { n: "2 years", l: "average time to find a degree-relevant full-time job" },
    { n: "$600", l: "average salary 2 years post-graduation (STEM)" },
  ];
  return (
    <Reveal>
      <Box className="flex px-4 sm:px-16 md:px-[120px] py-[75px] flex-col">
        <Box className="w-full">
          <Typography
            sx={{ fontSize: 14, fontWeight: 600, color: BRAND.green, letterSpacing: "0.05em" }}
          >
            THE REALITY
          </Typography>
          <Typography
            className="text-balance"
            sx={{
              fontFamily: "var(--font-plus-jakarta), sans-serif",
              fontSize: { xs: 22, md: 28 },
              fontWeight: 600,
              color: BRAND.ink,
              mt: "24px",
              lineHeight: "42px",
              letterSpacing: "-1.1%",
              maxWidth: 820,
            }}
          >
            You didn’t study STEM to earn $250 a month. For most university
            graduates in Africa, this is the starting point.
          </Typography>
          <Box
            className="mt-[90px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[60px]"
            sx={{ display: "grid", gap: 6, mt: "90px", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3,1fr)" } }}
          >
            {stats.map((s) => (
              <Box key={s.n} className="flex items-center flex-col gap-3" sx={{ textAlign: "center" }}>
                <Typography
                  sx={{
                    fontSize: 44,
                    lineHeight: "48px",
                    fontWeight: 500,
                    color: BRAND.ink,
                    letterSpacing: "-1.1%",
                  }}
                >
                  {s.n}
                </Typography>
                <Typography sx={{ fontSize: 16, color: BRAND.slate }}>{s.l}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Reveal>
  );
}

/* ---------------- THE OPPORTUNITY ---------------- */
export function Opportunity() {
  const cards = [
    { icon: "/learn.svg", title: "Learn", desc: "World-class training built for the global market." },
    { icon: "/prove.svg", title: "Prove", desc: "Real work experience with international companies." },
    { icon: "/earn-logo.svg", title: "Earn", desc: "A chance to triple your earning potential." },
    { icon: "/compete.svg", title: "Compete", desc: "Build the confidence to stand out globally." },
  ];
  return (
    <Reveal>
      <Box className="flex px-4 sm:px-16 md:px-[120px] py-[75px] flex-col">
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: BRAND.green, letterSpacing: "0.05em" }}>
          THE OPPORTUNITY
        </Typography>
        <Box className="flex gap-[31px] mt-[34px]" sx={{ display: "flex", gap: "31px", mt: "34px" }}>
          <Divider orientation="vertical" flexItem />
          <Typography
            sx={{
              fontFamily: "var(--font-plus-jakarta), sans-serif",
              fontSize: 28,
              fontWeight: 600,
              color: BRAND.ink,
              maxWidth: 720,
            }}
          >
            Remote roles offer up to 5x more for honed skills. We prepare
            high-potential talent for the global market.
          </Typography>
        </Box>
        <Box
          className="mt-[90px] grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-[16px]"
          sx={{ display: "grid", gap: "16px", mt: "90px", gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)", md: "repeat(4,1fr)" } }}
        >
          {cards.map((c) => (
            <Box
              key={c.title}
              className="flex items-center flex-col px-[20px] pt-[19px] pb-[24px] border rounded-[8px]"
              sx={{ border: `1px solid ${BRAND.cardBorder}`, borderRadius: "8px", textAlign: "center" }}
            >
              <Image src={c.icon} alt="icon" width={44} height={44} />
              <Typography sx={{ color: BRAND.greenDeep, fontWeight: 600, fontSize: 18, mt: "12px" }}>
                {c.title}
              </Typography>
              <Typography sx={{ fontSize: 16, color: BRAND.slateBlue, mt: "12px" }}>{c.desc}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Reveal>
  );
}

/* ---------------- THE ALTERNATIVE ---------------- */
export function Alternative() {
  const regular = [
    "Learning that focuses more on theory than application",
    "Entry level roles asking for years of experience",
    "Breaking into a competitive market with a portfolio still in progress",
    "Internship hunting without real guidance",
    "Sending connection requests until LinkedIn thinks you are a bot",
    "Career advice shared with 500 others",
    "Costs that are fixed regardless of the outcome",
    "Hope for the best",
  ];
  const directed = [
    "Remote internships with US, European and African companies",
    "Personalised career strategy",
    "Training to prepare you for cross-cultural work",
    "Mentorship matching",
    "Masterclass workshops",
    "Ongoing job-success coaching",
    "Personalised job placement support",
    "Quarterly personal development sessions",
    "Outcomes-based tuition: Pay only if you succeed",
  ];
  const Dot = ({ brand }: { brand?: boolean }) => (
    <Box
      component="span"
      sx={{
        mt: "10px",
        height: 6,
        width: 6,
        borderRadius: "50%",
        bgcolor: brand ? BRAND.green : "#BEC1C9",
        flexShrink: 0,
      }}
    />
  );
  return (
    <Reveal>
      <Box className="px-4 sm:px-6 py-[75px] md:px-[120px]">
        <Box className="w-full md:w-[75%]">
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: BRAND.green, letterSpacing: "0.05em" }}>
            THE ALTERNATIVE
          </Typography>
          <Typography
            className="sm:text-balance"
            sx={{
              mt: "24px",
              fontSize: { xs: 24, md: 48 },
              fontWeight: 700,
              color: BRAND.ink,
              lineHeight: { md: "60px" },
            }}
          >
            We give you an <Box component="span" sx={{ color: BRAND.slate }}>unfair advantage</Box> for a
            remote job in tech.
          </Typography>
        </Box>
        <Box
          className="mt-[30px] md:mt-[60px] grid gap-6 md:grid-cols-2"
          sx={{ display: "grid", gap: 4, mt: { md: "60px" }, gridTemplateColumns: { md: "1fr 1fr" } }}
        >
          <Box sx={{ bgcolor: BRAND.neutralBg, border: `1px solid ${BRAND.borderGrey}`, borderRadius: "16px", p: "32px 33px" }}>
            <Typography sx={{ textTransform: "capitalize", fontSize: 14, fontWeight: 600, letterSpacing: "0.24em", color: BRAND.slate }}>
              REGULAR UNIVERSITY ROUTE
            </Typography>
            <Box component="ul" sx={{ mt: 2, pl: 0, listStyle: "none" }}>
              {regular.map((t) => (
                <Box component="li" key={t} sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
                  <Dot />
                  <Typography sx={{ fontSize: 16, color: BRAND.slate }}>{t}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ bgcolor: BRAND.greenTint, border: `1px solid ${BRAND.green}`, borderRadius: "16px", p: "32px 33px" }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.24em", color: BRAND.greenDeep }}>
              THE DIRECTED TALENT PROGRAM
            </Typography>
            <Box component="ul" sx={{ mt: 2, pl: 0, listStyle: "none" }}>
              {directed.map((t) => (
                <Box component="li" key={t} sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
                  <Dot brand />
                  <Typography sx={{ fontSize: 16, color: BRAND.ink }}>{t}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Reveal>
  );
}

/* ---------------- STATS BAND ---------------- */
export function Stats() {
  const items = [
    { n: "$2,000", l: "Average monthly earnings of our graduates" },
    { n: "70+", l: "Students placed in remote internships" },
    { n: "5+", l: "Projects you can showcase in your portfolio" },
    { n: "1:1", l: "Mentorship from global professionals" },
  ];
  return (
    <Reveal variant="fade" duration={0.8}>
      <Box
        className="mt-[55px] bg-[#F1F2F0] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-4 px-8 md:px-[60px] lg:px-[100px] py-[40px] md:py-[57px]"
        sx={{ bgcolor: BRAND.greenTint, display: "grid", gap: { xs: 6, md: 4 }, gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3,1fr)", md: "repeat(4,1fr)" }, py: { xs: "40px", md: "57px" }, px: { xs: 4, md: "60px", lg: "100px" } }}
      >
        {items.map((s, i) => (
          <Box key={s.l} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography sx={{ color: BRAND.greenDeep, fontSize: { xs: 18, md: 28 }, fontWeight: 600 }}>
                {s.n}
              </Typography>
              <Typography sx={{ fontSize: 14, color: BRAND.slate, fontWeight: 500, maxWidth: 200 }}>
                {s.l}
              </Typography>
            </Box>
            {i < items.length - 1 && (
              <Divider orientation="vertical" flexItem sx={{ borderColor: BRAND.divider, display: { xs: "none", sm: "none", md: "block" } }} />
            )}
          </Box>
        ))}
      </Box>
    </Reveal>
  );
}

/* ---------------- HOW IT WORKS ---------------- */
function StepCard({ step, title, desc }: { step: string; title: string; desc: string }) {
  return (
    <Box sx={{ border: `1px solid ${BRAND.stepBorder}`, borderRadius: "8px", p: "19px 12px" }}>
      <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.24em", color: BRAND.greenDeep }}>
        {step}
      </Typography>
      <Typography sx={{ mt: "8px", fontSize: 16, fontWeight: 600, color: BRAND.ink }}>{title}</Typography>
      <Typography sx={{ mt: "8px", fontSize: 14, color: BRAND.slate }}>{desc}</Typography>
    </Box>
  );
}

export function HowItWorks() {
  return (
    <Reveal>
      <Box component="section" id="how-it-works" className="py-[75px] px-4 md:px-[60px] lg:px-[120px]">
        <Typography sx={{ fontSize: { xs: 32, md: 48 }, fontWeight: 700, color: BRAND.ink, lineHeight: { md: "64px" } }}>
          Is it hard to join?
        </Typography>
        <Typography sx={{ mt: "10px", fontSize: 16, color: BRAND.slate, maxWidth: 720 }}>
          From ambitious beginners to rising experts, we build{" "}
          <Box component="span" sx={{ fontWeight: 600, color: BRAND.greenDeep }}>
            Africa&apos;s top 0.1%
          </Box>
        </Typography>
        <Typography sx={{ mt: "10px", fontSize: 18, fontWeight: 600, color: BRAND.ink }}>
          Just prove you can commit.
        </Typography>
        <Box className="mt-[61px] grid grid-cols-1 gap-4 lg:grid-cols-12" sx={{ display: "grid", gap: 3, mt: "61px", gridTemplateColumns: { lg: "repeat(12,1fr)" } }}>
          <Box className="lg:col-span-9 flex flex-col gap-4" sx={{ gridColumn: { lg: "span 9" }, display: "flex", flexDirection: "column", gap: 3 }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 2, alignItems: "stretch" }}>
              <Box sx={{ width: { lg: 160 }, flexShrink: 0, display: "flex", alignItems: "center" }}>
                <Typography sx={{ textTransform: "uppercase", fontSize: 20, fontWeight: 600, color: BRAND.greenDeep, letterSpacing: "0.15em" }}>
                  0-2 years experience
                </Typography>
              </Box>
              <Box sx={{ flex: 1, display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" }, gap: 3 }}>
                <StepCard step="STEP 01" title="Register" desc="Sign up and tell us about yourself." />
                <StepCard step="STEP 02" title="Learn" desc="If selected, your bootcamp journey starts." />
                <StepCard step="STEP 03" title="Assess" desc="Take our assessment to prove your skills." />
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 2, alignItems: "stretch" }}>
              <Box sx={{ width: { lg: 160 }, flexShrink: 0, display: "flex", alignItems: "center" }}>
                <Typography sx={{ textTransform: "uppercase", fontSize: 20, fontWeight: 600, color: BRAND.greenDeep, letterSpacing: "0.15em" }}>
                  2 years+ experience
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <StepCard
                  step="STEP 01"
                  title="Assess"
                  desc="Think you're ready? Take our assessment and demonstrate your real‑world ability. From Full‑Stack Engineering and UI/UX Design to Machine Learning and GTM strategy."
                />
              </Box>
            </Box>
          </Box>
          <Box sx={{ gridColumn: { lg: "span 3" } }}>
            <Box sx={{ bgcolor: BRAND.neutralBg, border: `1px solid ${BRAND.stepBorder}`, borderRadius: "8px", p: "19px 12px", height: "100%" }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: BRAND.greenDeep }}>Begin</Typography>
              <Typography sx={{ mt: "10px", fontSize: 14, color: BRAND.slate }}>
                Join our talent program and gain real-world experience with leading European and U.S. companies.
              </Typography>
              <Typography sx={{ mt: "24px", fontSize: 14, color: BRAND.slate }}>
                Learn on the job, receive expert mentorship, earn a learning stipend, and get dedicated job placement support.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Reveal>
  );
}

/* ---------------- WE ARE RECOGNIZED ---------------- */
export function Recognized() {
  const cards = [
    { t: "Preparing Future Unicorn Founders", d: "Having received training from 50+ unicorn investor Tim Draper himself, we know what it takes." },
    { t: "World Class Mentorship", d: "Our mentors include people from, companies like Google, Apple, Canva, Spotify, Goldman Sachs and more." },
    { t: "Award-Winning Program", d: "Our entrepreneurship training is a two-time winner at the African Startup Ecosystem Builder summit" },
  ];
  return (
    <Reveal>
      <Box className="px-4 md:px-[60px] lg:px-[120px] py-[72px] md:py-[98px]">
        <Typography sx={{ fontSize: { xs: 32, md: 48 }, fontWeight: 700, color: BRAND.ink }}>
          We are <Box component="span" sx={{ color: BRAND.slate }}>recognized.</Box>
        </Typography>
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 mt-[40px]" sx={{ display: "grid", gap: { md: 10 }, mt: "40px", gridTemplateColumns: { md: "repeat(3,1fr)" } }}>
          {cards.map((c) => (
            <Box key={c.t} sx={{ display: "flex", flexDirection: "column", gap: "12px", minHeight: 123, py: "15px", borderTop: `1px solid ${BRAND.greenDeep}` }}>
              <Typography sx={{ fontSize: 18, fontWeight: 500, color: BRAND.ink }}>{c.t}</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: BRAND.slate }}>{c.d}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Reveal>
  );
}

/* ---------------- COLLABORATORS ---------------- */
export function Collaborators() {
  const logos = [
    { src: "/tally.svg", alt: "Tally", w: 105 },
    { src: "/lovable.svg", alt: "Lovable", w: 105 },
    { src: "/canva.svg", alt: "Canva", w: 105 },
    { src: "/apple.svg", alt: "Apple", w: 105 },
    { src: "/cardano.svg", alt: "Cardano", w: 105 },
    { src: "/lido-nation.svg", alt: "LidoNation", w: 105 },
    { src: "/google.svg", alt: "Google", w: 105 },
    { src: "/tison.svg", alt: "Tison", w: 105 },
  ];
  return (
    <Reveal>
      <Box className="py-[60px] md:py-[75px] px-4 md:px-[60px] lg:px-[120px]">
        <Typography sx={{ textAlign: "center", textTransform: "uppercase", color: BRAND.slate, fontWeight: 600, letterSpacing: "0.24em", fontSize: 14 }}>
          collaborators and mentors from
        </Typography>
        <Box
          className="mt-[61px] grid grid-cols-2 md:grid-cols-4 gap-0 rounded-lg overflow-hidden border-l"
          sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" }, mt: "61px", borderLeft: `1px solid ${BRAND.borderGrey}`, borderRadius: "8px", overflow: "hidden" }}
        >
          {logos.map((l) => (
            <Box
              key={l.alt}
              sx={{
                height: { xs: 80, md: 100 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRight: `1px solid ${BRAND.borderGrey}`,
                borderTop: { xs: `1px solid ${BRAND.borderGrey}`, md: "none" },
                p: "32px 33px",
              }}
            >
              <Image src={l.src} alt={l.alt} width={l.w} height={40} style={{ height: "auto", width: l.w }} />
            </Box>
          ))}
        </Box>
      </Box>
    </Reveal>
  );
}

/* ---------------- TESTIMONIAL ---------------- */
export function Testimonial() {
  return (
    <Reveal>
      <Box component="section" className="py-[75px] md:px-[120px]">
        <Typography sx={{ fontSize: { xs: 32, md: 48 }, fontWeight: 700, color: BRAND.ink }}>
          What our students say
        </Typography>
        <Box sx={{ display: "flex", gap: "24px", alignItems: "center", mt: "40px", maxWidth: 900 }}>
          <Image src="/victoria-portrait.svg" alt="Victoria Essien" width={120} height={120} style={{ borderRadius: "50%", flexShrink: 0 }} />
          <Typography sx={{ fontSize: 18, color: BRAND.ink, fontStyle: "italic" }}>
            “Working with DirectEd gave me the opportunity to collaborate with talented designers and engineers while contributing to real products for startups. The experience helped me grow quickly, both technically and professionally, and opened doors to international opportunities, including my current role as a software engineer.”
          </Typography>
        </Box>
        <Typography sx={{ mt: "16px", ml: { md: "144px" }, color: BRAND.slate }}>
          — Victoria Essien, Software Engineer · Abuja, Nigeria
        </Typography>
      </Box>
    </Reveal>
  );
}

/* ---------------- FINAL CTA ---------------- */
export function FinalCTA() {
  return (
    <Reveal>
      <Box component="section" className="py-[75px] md:px-[120px]">
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <Typography sx={{ fontSize: { xs: 28, md: 48 }, fontWeight: 700, color: BRAND.ink, textAlign: "center", lineHeight: { md: "60px" } }}>
            Ready to Rise to the top?
          </Typography>
          <Button
            component="a"
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              backgroundColor: BRAND.greenDeep,
              color: "#fff",
              borderRadius: "5px",
              px: 4,
              py: "12px",
              textTransform: "none",
              fontFamily: "var(--font-dm-sans), sans-serif",
              "&:hover": { backgroundColor: "#2c3f2f" },
            }}
          >
            Express Interest
          </Button>
        </Box>
      </Box>
    </Reveal>
  );
}

/* ---------------- FOOTER ---------------- */
export function Footer() {
  const socials = [
    { src: "/instagram-logo.svg", alt: "Instagram" },
    { src: "/x-logo.svg", alt: "X" },
    { src: "/linkedin-logo.svg", alt: "LinkedIn" },
    { src: "/telegram-logo.svg", alt: "Telegram" },
  ];
  return (
    <Box component="footer" sx={{ bgcolor: "#fff", borderTop: `1px solid ${BRAND.borderGrey}`, px: { xs: 4, md: "120px" }, py: "40px" }}>
      <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>Directed Development Ltd</Typography>
      <Typography sx={{ fontSize: 14, color: BRAND.slate, mt: 1 }}>
        Address: 167-169 Great Portland Street, 5th Floor, London, W1W 5PF
      </Typography>
      <Typography sx={{ fontSize: 14, color: BRAND.slate }}>Company number: 14900281</Typography>
      <Typography sx={{ fontSize: 14, color: BRAND.slate, mt: 1 }}>Contact Us</Typography>
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        {socials.map((s) => (
          <Box
            key={s.alt}
            component="a"
            href="#"
            aria-label={s.alt}
            sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}
          >
            <Image src={s.src} alt={s.alt} width={20} height={20} />
          </Box>
        ))}
      </Box>
      <Typography sx={{ fontSize: 13, color: BRAND.slate, mt: 3 }}>
        Copyright ©2026 DirectEd Development. All rights reserved.
      </Typography>
    </Box>
  );
}
