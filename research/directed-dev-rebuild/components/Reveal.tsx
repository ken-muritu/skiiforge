"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  variant?: "fadeUp" | "fade";
  duration?: number;
  className?: string;
};

const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  },
  fade: {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.8 } },
  },
};

export function Reveal({
  children,
  variant = "fadeUp",
  duration,
  className,
}: Props) {
  const v = variants[variant];
  if (duration) v[variant === "fade" ? "show" : "show"].transition = { duration };
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
      variants={v}
    >
      {children}
    </motion.div>
  );
}
