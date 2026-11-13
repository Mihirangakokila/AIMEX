"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "@/components/project/ProjectCard";
import { KineticTicker } from "@/components/ui/KineticTicker";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { filters, type Filter } from "@/lib/content";
import type { Project } from "@/lib/types";

export function FeaturedWork({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");

  const visible = useMemo(() => {
    if (filter === "ALL") {
      const featured = projects.filter((p) => p.featured);
      return (featured.length >= 4 ? featured : projects).slice(0, 6);
    }
    return projects.filter((p) => p.category === filter).slice(0, 6);
  }, [filter, projects]);

  const [first, second, third, fourth, fifth, sixth] = visible;

  return (
    <section id="work" className="pt-24 md:pt-32">
      <div className="px-5 md:px-10 lg:px-14">
        <Reveal>
          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-mono tracking-[0.28em] text-gold uppercase">01 // PORTFOLIO</p>
              <h2 className="mt-2 font-display text-5xl font-bold uppercase leading-none tracking-tight md:text-7xl">
                Selected Work
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-cream/70 md:text-right">
              A curated selection of digital platforms, brand identities, editorial photography, and films created by AIMEX.
            </p>
          </div>
        </Reveal>

        {/* Category Filter Pills */}
        <div className="mb-16 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {filters.map((item) => {
            const active = filter === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`relative flex shrink-0 items-center rounded-full px-4 py-2 text-[11px] tracking-[0.2em] uppercase transition-colors focus:outline-none ${
                  active ? "text-ink font-semibold" : "text-cream/60 hover:text-cream border border-white/10"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="homeFilterPill"
                    className="absolute inset-0 rounded-full bg-gold shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Asymmetric Grid with Motion */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-16 md:gap-28"
          >
            {first && (
              <div className="md:ml-auto md:w-[82%]">
                <ProjectCard project={first} index={0} aspect="aspect-[4/5] md:aspect-[16/10]" frame="wide" sizes="80vw" priority />
              </div>
            )}

            {(second || third) && (
              <div className="grid items-start gap-12 md:grid-cols-12 md:gap-8">
                {second && (
                  <div className="md:col-span-5 md:mt-24">
                    <ProjectCard project={second} index={1} aspect="aspect-[4/5]" sizes="40vw" />
                  </div>
                )}
                {third && (
                  <div className="md:col-span-6 md:col-start-7">
                    <ProjectCard project={third} index={2} aspect="aspect-[3/4]" sizes="45vw" />
                  </div>
                )}
              </div>
            )}

            {fourth && (
              <ProjectCard project={fourth} index={3} aspect="aspect-[16/10] md:aspect-[21/9]" frame="wide" sizes="100vw" />
            )}

            {(fifth || sixth) && (
              <div className="grid items-start gap-12 md:grid-cols-12 md:gap-8">
                {fifth && (
                  <div className="md:col-span-6">
                    <ProjectCard project={fifth} index={4} aspect="aspect-[4/5] md:aspect-[16/11]" frame="wide" sizes="50vw" />
                  </div>
                )}
                {sixth && (
                  <div className="md:col-span-5 md:col-start-8 md:mt-16">
                    <ProjectCard project={sixth} index={5} aspect="aspect-[4/5]" sizes="40vw" />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* View All Projects Button */}
        <div className="mt-20 mb-24 flex items-center justify-between border-t border-white/10 pt-10">
          <p className="text-xs font-mono text-cream/45 uppercase tracking-widest">
            Showing {visible.length} of {projects.length} Projects
          </p>
          <Magnetic>
            <Link
              href="/work"
              className="group inline-flex items-center gap-3 rounded-full border border-gold/40 px-6 py-3 font-display text-[11px] font-medium tracking-[0.24em] text-gold uppercase transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ink"
            >
              <span>VIEW FULL PORTFOLIO</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </Magnetic>
        </div>
      </div>

      {/* Kinetic Typography Ticker Ribbon */}
      <KineticTicker speed={30} />
    </section>
  );
}
