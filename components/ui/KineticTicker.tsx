"use client";

import { motion } from "framer-motion";

export function KineticTicker({
  items = [
    "AIMEX STUDIO",
    "WEBSITE DESIGN & DEV",
    "BRANDING & GRAPHIC DESIGN",
    "EDITORIAL PHOTOGRAPHY",
    "CINEMATIC VIDEOGRAPHY",
    "SOCIAL MEDIA MARKETING",
    "PROMOTIONAL CONTENT",
    "WORK THAT GETS NOTICED",
  ],
  speed = 28,
  reverse = false,
}: {
  items?: string[];
  speed?: number;
  reverse?: boolean;
}) {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-charcoal/40 py-4 select-none backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />

      <motion.div
        className="flex w-fit items-center whitespace-nowrap"
        animate={{
          x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
      >
        {repeated.map((item, idx) => (
          <div key={idx} className="flex items-center">
            <span className="font-display text-[12px] font-medium tracking-[0.32em] text-cream/70 uppercase transition-colors hover:text-gold md:text-sm">
              {item}
            </span>
            <span className="mx-6 text-[10px] text-gold/60 md:mx-10">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
