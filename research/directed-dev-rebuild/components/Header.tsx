"use client";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Image from "next/image";
import Link from "next/link";

const APPLY_URL = "https://tally.so/r/2Er8jD";

export function Header() {
  return (
    <AppBar position="relative" elevation={4} color="transparent">
      <Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: 56, sm: 64 } }}>
        <Link href="/" aria-label="DirectEd Development home">
          <Image
            src="/directed-development.svg"
            alt="Directed development Logo"
            width={157}
            height={40}
            priority
          />
        </Link>
        <Box className="flex gap-[28px]" alignItems="center">
          <Link href="/about-us">
            <Button
              variant="outlined"
              color="inherit"
              sx={{
                borderColor: "#1e1e1e",
                color: "#1e1e1e",
                borderRadius: "5px",
                fontSize: 14,
                fontWeight: 500,
                textTransform: "none",
                fontFamily: "var(--font-inter), sans-serif",
                px: 1.5,
                py: 0.5,
                "&:hover": { borderColor: "#1e1e1e", backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              About Us
            </Button>
          </Link>
          <Button
            component="a"
            href={APPLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            color="inherit"
            sx={{
              borderColor: "#1e1e1e",
              color: "#1e1e1e",
              borderRadius: "5px",
              fontSize: 14,
              fontWeight: 500,
              textTransform: "none",
              fontFamily: "var(--font-inter), sans-serif",
              px: 1.5,
              py: 0.5,
              "&:hover": { borderColor: "#1e1e1e", backgroundColor: "rgba(0,0,0,0.04)" },
            }}
          >
            Apply Now
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
