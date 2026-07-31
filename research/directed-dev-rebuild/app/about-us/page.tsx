import { Header } from "../../components/Header";
import { Footer } from "../../components/sections";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Reveal } from "../../components/Reveal";
import { BRAND } from "../../tokens";

export const metadata = {
  title: "About Us · DirectEd Development",
};

const APPLY_URL = "https://tally.so/r/2Er8jD";

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

const STATS = [
  { n: "20+", l: "Remote internship partners" },
  { n: "90%", l: "Employment rate" },
  { n: "5x", l: "Potential earning increase" },
];

const TEAM = [
  {
    name: "Simon Sällström",
    role: "Founder & CEO",
    bio: "MPhil in Economics from Oxford. Leading DirectEd’s mission to develop world-class African tech talent.",
  },
  {
    name: "Kidus Elias",
    role: "Curriculum Design Lead",
    bio: "BSc in Computer Science. Born and raised in Addis Ababa, designing learning experiences that work.",
  },
  {
    name: "Ananya Fekeremariam",
    role: "Head of Engineering",
    bio: "BSc in Computer Science with Electrical Engineering background. Ex-Google intern building DirectEd’s platform.",
  },
];

const ADVISORS = [
  { name: "Alessandro Zanardi", role: "CEO", org: "Codeworks" },
  { name: "Christian Meyer", role: "Director", org: "Oxford Martin Programme on Future of Development" },
  { name: "Jane Mwangi", role: "AJW Africa", org: "" },
  { name: "Rasmus Fonnesbaek Andersen", role: "Senior Manager", org: "Tony Blair Institute" },
];

export default function AboutUsPage() {
  return (
    <>
      <Header />
      <Box component="main" sx={{ bgcolor: "#fff" }}>
        {/* HERO */}
        <Box sx={{ px: PAD_X, pt: { xs: "95px", md: "120px" }, pb: SECTION_PY, textAlign: { md: "center" } }}>
          <Typography sx={eyebrow}>ABOUT US</Typography>
          <Typography
            sx={{
              ...h2Title,
              fontSize: { xs: 32, md: 56 },
              lineHeight: { md: "64px" },
              mt: "24px",
              maxWidth: 900,
              mx: "auto",
            }}
          >
            Building the bridge between{" "}
            <Box component="span" sx={{ color: BRAND.green }}>
              Africa’s best talent
            </Box>{" "}
            and global opportunity
          </Typography>
        </Box>

        {/* STATS */}
        <Reveal>
          <Box
            sx={{
              bgcolor: BRAND.greenTint,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" },
              gap: { xs: "32px", md: "24px" },
              py: { xs: "40px", md: "57px" },
              px: { xs: "32px", md: "60px", lg: "100px" },
              textAlign: "center",
            }}
          >
            {STATS.map((s) => (
              <Box key={s.l}>
                <Typography sx={{ color: BRAND.greenDeep, fontSize: { xs: 36, md: 44 }, fontWeight: 700, letterSpacing: "-0.01em" }}>
                  {s.n}
                </Typography>
                <Typography sx={{ fontSize: 16, color: BRAND.slate, mt: "8px" }}>{s.l}</Typography>
              </Box>
            ))}
          </Box>
        </Reveal>

        {/* MISSION */}
        <Reveal>
          <Box sx={{ px: PAD_X, py: SECTION_PY, maxWidth: 900 }}>
            <Typography sx={{ ...h2Title, fontSize: { xs: 24, md: 32 } }}>
              Developing world-class talent for everyone
            </Typography>
            <Typography sx={{ ...bodyText, mt: "24px" }}>
              DirectEd exists to identify, train, and connect Africa’s most exceptional students with high-performance engineering roles at global companies.
            </Typography>
            <Typography sx={{ ...bodyText, mt: "16px" }}>
              We provide the rigorous training, real-world experience, and professional networks that turn potential into careers.
            </Typography>
          </Box>
        </Reveal>

        {/* FOUNDER QUOTE */}
        <Reveal>
          <Box sx={{ px: PAD_X, py: SECTION_PY, maxWidth: 820 }}>
            <Typography sx={eyebrow}>A WORD FROM THE FOUNDER</Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-plus-jakarta), sans-serif",
                fontSize: { xs: 20, md: 28 },
                fontWeight: 600,
                lineHeight: "38px",
                color: BRAND.ink,
                mt: "24px",
              }}
            >
              “When I first encountered the talent coming out of East African universities, I was struck by a simple truth: these students were as capable as anyone I’d studied alongside at Oxford. What they lacked wasn’t ability but the infrastructure to prove it.
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-plus-jakarta), sans-serif",
                fontSize: { xs: 20, md: 28 },
                fontWeight: 600,
                lineHeight: "38px",
                color: BRAND.ink,
                mt: "16px",
              }}
            >
              DirectEd was built to change that equation. Not with another online course, but with an immersive program that mirrors how the best engineers in the world actually learn — by building, shipping, and being held to the highest standards.
            </Typography>
            <Typography
              sx={{
                fontFamily: "var(--font-plus-jakarta), sans-serif",
                fontSize: { xs: 20, md: 28 },
                fontWeight: 600,
                lineHeight: "38px",
                color: BRAND.ink,
                mt: "16px",
              }}
            >
              Every step we’ve taken has been guided by a commitment to putting people first — our learners, our partners, and the communities we serve.”
            </Typography>
            <Typography sx={{ mt: "24px", fontWeight: 600, color: BRAND.greenDeep }}>
              Simon Sällström — Founder &amp; CEO
            </Typography>
          </Box>
        </Reveal>

        {/* TEAM */}
        <Reveal>
          <Box sx={{ px: PAD_X, py: SECTION_PY }}>
            <Typography sx={{ ...h2Title, fontSize: { xs: 28, md: 40 } }}>Meet The Team</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { md: "repeat(3,1fr)" }, gap: 4, mt: "40px" }}>
              {TEAM.map((m) => (
                <Box key={m.name} sx={{ borderTop: `1px solid ${BRAND.greenDeep}`, pt: "16px" }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 600, color: BRAND.ink }}>{m.name}</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: BRAND.greenDeep, mt: "4px" }}>{m.role}</Typography>
                  <Typography sx={{ ...bodyText, mt: "12px", fontSize: 14 }}>{m.bio}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Reveal>

        {/* ADVISORS */}
        <Reveal>
          <Box sx={{ px: PAD_X, py: SECTION_PY }}>
            <Typography sx={{ ...h2Title, fontSize: { xs: 28, md: 40 } }}>Our Advisors</Typography>
            <Typography sx={{ ...bodyText, mt: "16px" }}>
              Industry leaders and entrepreneurs who guide our strategy and standards
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { sm: "1fr 1fr", md: "repeat(4,1fr)" }, gap: 3, mt: "32px" }}>
              {ADVISORS.map((a) => (
                <Box key={a.name} sx={{ border: `1px solid ${BRAND.borderGrey}`, borderRadius: "12px", p: "20px" }}>
                  <Typography sx={{ fontSize: 18, fontWeight: 600, color: BRAND.ink }}>{a.name}</Typography>
                  <Typography sx={{ fontSize: 14, color: BRAND.slateBlue, mt: "4px" }}>{a.role}{a.org ? ` · ${a.org}` : ""}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <Box sx={{ px: PAD_X, py: SECTION_PY, textAlign: "center" }}>
            <Typography sx={{ ...h2Title, fontSize: { xs: 28, md: 40 } }}>Ready to join us?</Typography>
            <Typography sx={{ ...bodyText, mt: "16px", maxWidth: 600, mx: "auto" }}>
              If you’re among the best and ready to prove it, we want to hear from you.
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
                mt: "24px",
                textTransform: "none",
                fontFamily: "var(--font-dm-sans), sans-serif",
                "&:hover": { backgroundColor: "#2c3f2f" },
              }}
            >
              Get in touch
            </Button>
          </Box>
        </Reveal>
      </Box>
      <Footer />
    </>
  );
}
