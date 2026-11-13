"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import { offerings } from "@/lib/content";
import { cn } from "@/lib/utils";

export function ServicesExplorer({ titleAs = "h2" }: { titleAs?: "h1" | "h2" }) {
  const [active, setActive] = useState(0);
  const Title = titleAs;
  const current = offerings[active];

  return (
    <section className="px-5 py-24 md:px-10 md:py-32 lg:px-14">
      <p className="mb-3 font-mono text-[11px] tracking-[0.28em] text-gold uppercase">03 // OUR SERVICES</p>
      <Title className="mb-12 font-display text-5xl font-bold uppercase leading-none tracking-tight md:mb-16 md:text-7xl">
        What We Do
      </Title>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          {offerings.map((service, index) => {
            const open = active === index;
            return (
              <button
                key={service.number}
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                className="block w-full cursor-pointer border-t border-white/10 py-6 text-left last:border-b"
                aria-expanded={open}
              >
                <span className="flex items-baseline gap-5 md:gap-8">
                  <span className="w-8 shrink-0 text-[11px] tracking-[0.2em] text-gold">{service.number}</span>
                  <span
                    className={cn(
                      "font-display text-3xl font-medium uppercase leading-none tracking-tight transition-colors md:text-5xl",
                      open ? "text-cream" : "text-cream/40",
                    )}
                  >
                    {service.title}
                  </span>
                </span>
                <span className={cn("grid transition-[grid-template-rows] duration-500", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <span className="overflow-hidden">
                    <span className="block max-w-md pt-4 pl-12 text-sm leading-relaxed text-cream/70 md:pl-16 md:text-base">
                      {service.description}
                    </span>
                    <span className="relative mt-6 block aspect-[16/10] overflow-hidden lg:hidden">
                      <ProjectVisual title={service.title} category={service.category} seed={service.seed} frame="wide" />
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative hidden min-h-[640px] lg:col-span-5 lg:block">
          <div className="sticky top-28 h-[72vh] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.number}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <ProjectVisual title={current.title} category={current.category} seed={current.seed} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
