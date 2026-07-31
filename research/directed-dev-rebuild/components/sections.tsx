import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Image from "next/image";
import { Reveal } from "./Reveal";
import { BRAND } from "../tokens";

const APPLY_URL = "https://tally.so/r/2Er8jD";

// Responsive padding scale matched to the original (px):
// mobile 16/24 -> sm 40 -> md 80 -> lg 120
const PAD_X = { xs: "16px", sm: "40px", md: "80px", lg: "120px" } as const;
const SECTION_PY = { xs: "56px", sm: "72px", md: "75px" } as const;

const eyebrow = {
  fontSize: 14,
  fontWeight: 600,
  color: BRAND.green,
  letterSpacing: "0.24em",
  textTransform: "uppercase" as const,
};
const h2Title = {
  fontFamily: "var(--font-plus-jakarta), sans-serif",
  fontSize: { xs: 24, md: 48 },
  fontWeight: 700,
  color: BRAND.ink,
  lineHeight: { md: "60px" },
  letterSpacing: "-0.01em",
};
const bodyText = {
  fontSize: { xs: 16, md: 18 },
  lineHeight: "26px",
  color: BRAND.slate,
};

/* ---------------- HERO ---------------- */
export function Hero() {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: { md: "100vh" },
        display: "flex",
        alignItems: { md: "center" },
        justifyContent: "center",
        pt: { xs: "95px", md: 0 },
        pb: { xs: "56px", md: "75px" },
        px: PAD_X,
      }}
    >
      {/* Faint 75px blueprint lattice, masked top & bottom (from manifest) */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `repeating-linear-gradient(0deg, ${BRAND.gridLine} 0, ${BRAND.gridLine} 1px, transparent 1px, transparent 75px), repeating-linear-gradient(90deg, ${BRAND.gridLine} 0, ${BRAND.gridLine} 1px, transparent 1px, transparent 75px)`,
          opacity: 0.5,
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)",
          maskImage:
            "linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)",
          pointerEvents: "none",
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1, width: "100%" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            component="h1"
            sx={{
              fontFamily: "var(--font-plus-jakarta), sans-serif",
              fontSize: { xs: 36, sm: 48, md: 96 },
              lineHeight: { md: "96px" },
              letterSpacing: "0%",
              fontWeight: 700,
              color: BRAND.ink,
            }}
          >
            <Box component="span">For the ones who </Box>
            <Box component="span" sx={{ color: BRAND.green }}>
              refuse average
            </Box>
            <Box component="span" sx={{ color: "#000" }}>
              .
            </Box>
          </Typography>
          <Typography
            sx={{
              ...bodyText,
              mt: "18px",
              maxWidth: 620,
              mx: "auto",
            }}
          >
            Intensive program that transforms raw talent into globally
            competitive engineers, with stipend supported internships and real
            placement support.
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              justifyContent: "center",
              pt: "24px",
            }}
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
                px: "32px",
                py: "10px",
                textTransform: "none",
                fontFamily: "var(--font-inter), sans-serif",
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
                px: "32px",
                py: "10px",
                textTransform: "none",
                fontFamily: "var(--font-inter), sans-serif",
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
      <Box sx={{ px: PAD_X, py: SECTION_PY }}>
        <Typography sx={eyebrow}>THE REALITY</Typography>
        <Typography
          sx={{
            ...h2Title,
            fontSize: { xs: 22, md: 28 },
            lineHeight: { md: "42px" },
            mt: "24px",
            maxWidth: 820,
          }}
        >
          You didn’t study STEM to earn $250 a month. For most university
          graduates in Africa, this is the starting point.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3,1fr)" },
            gap: { xs: "32px", md: "60px" },
            mt: "60px",
            textAlign: "center",
          }}
        >
          {stats.map((s) => (
            <Box key={s.n}>
              <Typography
                sx={{
                  fontSize: { xs: 36, md: 44 },
                  lineHeight: "48px",
                  fontWeight: 600,
                  color: BRAND.ink,
                  letterSpacing: "-0.01em",
                }}
              >
                {s.n}
              </Typography>
              <Typography sx={{ ...bodyText, mt: "12px" }}>{s.l}</Typography>
            </Box>
          ))}
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
      <Box sx={{ px: PAD_X, py: SECTION_PY }}>
        <Typography sx={eyebrow}>THE OPPORTUNITY</Typography>
        <Box sx={{ display: "flex", gap: "31px", mt: "34px" }}>
          <Divider orientation="vertical" flexItem />
          <Typography sx={{ ...h2Title, fontSize: { xs: 22, md: 28 }, lineHeight: "36px", maxWidth: 720 }}>
            Remote roles offer up to 5x more for honed skills. We prepare
            high-potential talent for the global market.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)", md: "repeat(4,1fr)" },
            gap: "16px",
            mt: "60px",
          }}
        >
          {cards.map((c) => (
            <Box
              key={c.title}
              sx={{
                border: `1px solid ${BRAND.cardBorder}`,
                borderRadius: "8px",
                textAlign: "center",
                px: "20px",
                pt: "19px",
                pb: "24px",
              }}
            >
              <Image src={c.icon} alt={c.title} width={44} height={44} />
              <Typography sx={{ color: BRAND.greenDeep, fontWeight: 600, fontSize: 18, mt: "12px" }}>
                {c.title}
              </Typography>
              <Typography sx={{ fontSize: 16, color: BRAND.slateBlue, mt: "12px" }}>
                {c.desc}
              </Typography>
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
      <Box sx={{ px: PAD_X, py: SECTION_PY }}>
        <Box sx={{ maxWidth: { md: "75%" } }}>
          <Typography sx={eyebrow}>THE ALTERNATIVE</Typography>
          <Typography
            sx={{
              ...h2Title,
              fontSize: { xs: 24, md: 48 },
              lineHeight: { md: "60px" },
              mt: "24px",
            }}
          >
            We give you an <Box component="span" sx={{ color: BRAND.slate }}>unfair advantage</Box> for a
            remote job in tech.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "1fr 1fr" },
            gap: 3,
            mt: { xs: "30px", md: "60px" },
          }}
        >
          <Box sx={{ bgcolor: BRAND.neutralBg, border: `1px solid ${BRAND.borderGrey}`, borderRadius: "16px", p: "32px 33px" }}>
            <Typography sx={{ textTransform: "uppercase", fontSize: 14, fontWeight: 600, letterSpacing: "0.24em", color: BRAND.slate }}>
              REGULAR UNIVERSITY ROUTE
            </Typography>
            <Box component="ul" sx={{ mt: 2, pl: 0, listStyle: "none" }}>
              {regular.map((t) => (
                <Box component="li" key={t} sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 1 }}>
                  <Dot />
                  <Typography sx={{ ...bodyText }}>{t}</Typography>
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
        sx={{
          bgcolor: BRAND.greenTint,
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3,1fr)", md: "repeat(4,1fr)" },
          gap: { xs: "32px", md: "24px" },
          py: { xs: "40px", md: "57px" },
          px: { xs: "32px", md: "60px", lg: "100px" },
        }}
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
              <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: BRAND.divider, display: { xs: "none", md: "block" } }}
              />
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
      <Box component="section" id="how-it-works" sx={{ py: SECTION_PY, px: PAD_X }}>
        <Typography sx={{ ...h2Title, fontSize: { xs: 32, md: 48 } }}>
          Is it hard to join?
        </Typography>
        <Typography sx={{ ...bodyText, mt: "10px", maxWidth: 720 }}>
          From ambitious beginners to rising experts, we build{" "}
          <Box component="span" sx={{ fontWeight: 600, color: BRAND.greenDeep }}>
            Africa&apos;s top 0.1%
          </Box>
        </Typography>
        <Typography sx={{ mt: "10px", fontSize: 18, fontWeight: 600, color: BRAND.ink }}>
          Just prove you can commit.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { lg: "repeat(12,1fr)" },
            gap: 3,
            mt: "61px",
          }}
        >
          <Box
            sx={{
              gridColumn: { lg: "span 9" },
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
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
      <Box sx={{ px: PAD_X, py: SECTION_PY }}>
        <Typography sx={{ ...h2Title, fontSize: { xs: 32, md: 48 } }}>
          We are <Box component="span" sx={{ color: BRAND.slate }}>recognized.</Box>
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "repeat(3,1fr)" },
            gap: { xs: "32px", md: "40px" },
            mt: "40px",
          }}
        >
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
      <Box sx={{ py: SECTION_PY, px: PAD_X }}>
        <Typography sx={{ textAlign: "center", textTransform: "uppercase", color: BRAND.slate, fontWeight: 600, letterSpacing: "0.24em", fontSize: 14 }}>
          collaborators and mentors from
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4,1fr)" },
            mt: "61px",
            borderLeft: `1px solid ${BRAND.borderGrey}`,
            borderRadius: "8px",
            overflow: "hidden",
          }}
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
      <Box component="section" sx={{ py: SECTION_PY, px: PAD_X }}>
        <Typography sx={{ ...h2Title, fontSize: { xs: 32, md: 48 } }}>
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
      <Box component="section" sx={{ py: SECTION_PY, px: PAD_X }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <Typography sx={{ ...h2Title, fontSize: { xs: 28, md: 48 }, textAlign: "center" }}>
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
              px: "32px",
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
    <Box component="footer" sx={{ bgcolor: "#fff", borderTop: `1px solid ${BRAND.borderGrey}`, px: PAD_X, py: "40px" }}>
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
