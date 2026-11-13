"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import type { Project } from "@/lib/types";

export function Showcase({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["2%", "-14%"]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["4%", "-4%"]);

  const strip =
    projects.length > 0
      ? Array.from({ length: Math.max(projects.length, 6) }, (_, index) => projects[index % projects.length])
      : [];

  return (
    <section ref={ref} className="relative h-[100svh] overflow-hidden" aria-label="Creative showcase">
      <motion.div style={{ x, y }} className="absolute top-[-8%] flex h-[120%] gap-3 md:gap-4">
        {strip.map((project, index) => (
          <div key={`${project.id}-${index}`} className="relative h-full w-[72vw] shrink-0 md:w-[28vw]">
            <ProjectMedia
              src={project.heroImage || project.thumbnail}
              alt={`${project.title} showcase`}
              title={project.title}
              category={project.category}
              seed={project.order + index}
              sizes="30vw"
            />
          </div>
        ))}
      </motion.div>
      <div className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" />
      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <div>
          <p className="mb-4 font-mono text-xs tracking-[0.3em] text-gold uppercase">04 // VISUAL IMPACT</p>
          <h2 className="font-display text-[clamp(3.2rem,8.5vw,7.8rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em]">
            Designed
            <br />
            <span className="text-gold">to be seen.</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
