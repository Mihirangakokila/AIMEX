"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { processSteps } from "@/lib/content";

export function Process() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <section ref={ref} className="px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <p className="text-[11px] font-mono tracking-[0.28em] text-gold uppercase">05 // OUR PROCESS</p>
      <h2 className="mt-3 max-w-4xl font-display text-5xl font-bold uppercase leading-[0.9] tracking-tight md:text-7xl">
        From idea
        <br />
        to impact
      </h2>
      <div className="relative mt-16">
        <motion.div style={reduce ? undefined : { scaleX: progress }} className="absolute top-2 right-0 left-0 hidden h-px origin-left bg-gold md:block" />
        <motion.div style={reduce ? undefined : { scaleY: progress }} className="absolute top-0 bottom-0 left-0 w-px origin-top bg-gold md:hidden" />
        <ol className="grid gap-12 md:grid-cols-4 md:gap-8">
          {processSteps.map((step) => (
            <li key={step.number} className="md:pt-8">
              <p className="text-[11px] tracking-[0.22em] text-gold">{step.number}</p>
              <h3 className="mt-4 font-display text-2xl uppercase tracking-tight">{step.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
