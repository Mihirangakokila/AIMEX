"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FluidCanvas } from "@/components/canvas/FluidCanvas";
import { quickInquiry } from "@/actions/inquiries";
import type { ActionState, Project } from "@/lib/types";

const initialActionState: ActionState = { ok: false };

const serviceCopy: Record<string, string> = {
  web: "Digital experiences designed to move your brand forward.",
  brand: "Distinctive identities that make your business recognisable.",
  media: "Photography and video that make people stop and look.",
  growth: "Content and campaigns that turn attention into momentum.",
};

const serviceTabs = [
  { id: "web", label: "Web Design" },
  { id: "brand", label: "Branding" },
  { id: "media", label: "Photo & Video" },
  { id: "growth", label: "Marketing" },
];

export function Hero({ projects = [] }: { projects?: Project[] }) {
  const reduce = useReducedMotion();
  const [activeService, setActiveService] = useState<string>("web");
  const [state, action, pending] = useActionState(quickInquiry, initialActionState);

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-ink px-5 pt-28 pb-14 text-center md:px-10 lg:px-14">
      {/* Interactive WebGL Fluid Simulation */}
      <FluidCanvas />

      {/* Ambient Lighting & Scrim Overlays */}
      <div className="scrim" aria-hidden="true" />
      <div className="ambient-grid" aria-hidden="true" />

      {/* Decorative Vertical Corner Note */}
      <div className="corner-note" aria-hidden="true">
        Ideas · Design · Digital
      </div>

      {/* Hero Centerpiece */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center py-8">
        {/* Badge Pill */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.075] px-4 py-1.5 text-xs font-medium tracking-[0.16em] text-cream/80 backdrop-blur-md uppercase shadow-sm"
        >
          <span className="badge-dot" />
          <span>Creative & Digital Agency</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.2, 0, 0, 1] }}
          className="mt-6 max-w-3xl font-display text-[clamp(2.75rem,7.5vw,5.6rem)] font-bold tracking-tight text-cream leading-[1.04]"
        >
          Ideas into <span className="text-gold">digital impact.</span>
        </motion.h1>

        {/* Subline */}
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.2, 0, 0, 1] }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-cream/70 md:text-lg"
        >
          We build standout websites, shape memorable brands, create powerful visuals, and help businesses grow online.
        </motion.p>

        {/* Interactive Service Selector Pills */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-white/12 bg-white/[0.05] p-1 backdrop-blur-md"
        >
          {serviceTabs.map((tab) => {
            const active = activeService === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveService(tab.id)}
                className={`cursor-pointer rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                  active ? "bg-white/15 text-gold font-semibold shadow-sm" : "text-cream/60 hover:text-cream"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Focus Note reacting to service tab */}
        <div className="mt-3 min-h-[1.75rem] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeService}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-xs tracking-wide text-cream/75 md:text-sm"
              aria-live="polite"
            >
              {serviceCopy[activeService]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Quick Project Form Capsule */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-7 w-full max-w-xl"
        >
          <form
            action={action}
            className="flex items-center w-full h-14 md:h-16 rounded-full border border-white/18 bg-white/[0.08] backdrop-blur-lg pl-5 pr-2 shadow-[0_8px_32px_rgba(0,0,0,0.36)] transition-all focus-within:border-gold/80 focus-within:shadow-[0_0_24px_rgba(0,240,255,0.3)]"
          >
            <label htmlFor="hero-email" className="sr-only">
              Your email address
            </label>
            <input
              id="hero-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent text-cream outline-none text-sm md:text-base placeholder:text-cream/45"
            />
            <button
              type="submit"
              disabled={pending}
              className="pill-button px-5 md:px-6 py-2.5 md:py-3 text-xs md:text-sm tracking-wider uppercase whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-60"
            >
              {pending ? "Sending..." : (
                <>
                  Start a Project <span aria-hidden="true">↗</span>
                </>
              )}
            </button>
          </form>

          {/* Form feedback status */}
          {state.message && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs text-gold tracking-wide font-medium"
              role="status"
            >
              {state.message}
            </motion.p>
          )}
          {state.error && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs text-red-400 tracking-wide font-medium"
              role="alert"
            >
              {state.error}
            </motion.p>
          )}
        </motion.div>

        {/* Service Strip Chips */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-lg"
          aria-label="AIMEX core services"
        >
          <Link
            href="/services#website-design-development"
            className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-xs text-cream/75 backdrop-blur-md transition-all hover:border-gold hover:text-gold hover:bg-white/[0.08]"
          >
            Websites
          </Link>
          <Link
            href="/services#branding-graphic-design"
            className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-xs text-cream/75 backdrop-blur-md transition-all hover:border-gold hover:text-gold hover:bg-white/[0.08]"
          >
            Brand Identity
          </Link>
          <Link
            href="/services#photography"
            className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-xs text-cream/75 backdrop-blur-md transition-all hover:border-gold hover:text-gold hover:bg-white/[0.08]"
          >
            Photography
          </Link>
          <Link
            href="/services#videography"
            className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-xs text-cream/75 backdrop-blur-md transition-all hover:border-gold hover:text-gold hover:bg-white/[0.08]"
          >
            Videography
          </Link>
          <Link
            href="/services#social-media-marketing"
            className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-xs text-cream/75 backdrop-blur-md transition-all hover:border-gold hover:text-gold hover:bg-white/[0.08]"
          >
            Social Media
          </Link>
        </motion.div>
      </div>

      {/* Bottom Exploration Cue */}
      <div className="relative z-10 mt-auto flex w-full items-center justify-between border-t border-white/10 pt-4 font-mono text-[11px] tracking-[0.2em] text-cream/45 uppercase">
        <a
          href="#work"
          className="inline-flex items-center gap-2 text-cream/70 transition-colors hover:text-gold"
        >
          <span>SCROLL TO EXPLORE WORK</span>
          <span className="text-gold">↓</span>
        </a>
        <span className="hidden sm:inline text-cream/40">
          EST. 2026 // {projects.length > 0 ? `${projects.length} ARCHIVED PROJECTS` : "STUDIO ARCHIVE"}
        </span>
      </div>
    </section>
  );
}
