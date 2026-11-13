"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "@/components/project/ProjectCard";
import { filters, type Filter } from "@/lib/content";
import type { Project } from "@/lib/types";

const spans = [
  "col-span-12 md:col-span-7",
  "col-span-12 md:col-span-5",
  "col-span-12 md:col-span-5 md:mt-20",
  "col-span-12 md:col-span-7",
  "col-span-12",
  "col-span-12 md:col-span-8 md:col-start-4",
];

const aspects = [
  "aspect-[4/5] md:aspect-[5/4]",
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[16/11]",
  "aspect-[16/8]",
  "aspect-[16/10]",
];

const frames: Array<"portrait" | "wide"> = ["portrait", "portrait", "portrait", "wide", "wide", "wide"];

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("ALL");

  const visible = useMemo(
    () => (filter === "ALL" ? projects : projects.filter((project) => project.category === filter)),
    [filter, projects],
  );

  // Calculate project counts per filter
  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: projects.length };
    filters.forEach((f) => {
      if (f !== "ALL") {
        map[f] = projects.filter((p) => p.category === f).length;
      }
    });
    return map;
  }, [projects]);

  return (
    <div>
      {/* Luxury Segmented Filter Bar */}
      <div className="sticky top-16 z-30 -mx-5 mb-14 border-y border-white/10 bg-ink/85 px-5 py-3 backdrop-blur-md md:top-20 md:mx-0 md:rounded-full md:border md:px-3 md:py-2 md:backdrop-blur-xl">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {filters.map((item) => {
            const active = filter === item;
            const count = counts[item] || 0;

            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item)}
                className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-200 focus:outline-none ${
                  active ? "text-ink font-semibold" : "text-cream/60 hover:text-cream"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-full bg-gold shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item}</span>
                <span
                  className={`relative z-10 text-[10px] font-mono transition-colors ${
                    active ? "text-ink/80" : "text-cream/40"
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="py-24 text-center">
          <p className="font-display text-2xl uppercase tracking-tight text-cream/80">No projects yet</p>
          <p className="mt-2 text-sm text-cream/50">There are no published works in this category right now.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-12 items-start gap-x-6 gap-y-16 md:gap-x-10 md:gap-y-24">
          <AnimatePresence mode="popLayout">
            {visible.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={spans[index % spans.length]}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  aspect={aspects[index % aspects.length]}
                  frame={frames[index % frames.length]}
                  sizes={index % 6 === 4 ? "100vw" : "(max-width: 768px) 100vw, 55vw"}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
