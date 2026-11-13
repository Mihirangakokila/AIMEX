"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { pad, projectSubtitle } from "@/lib/utils";
import type { Project } from "@/lib/types";

export function ProjectCard({
  project,
  index,
  aspect = "aspect-[4/5]",
  frame = "portrait",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: {
  project: Project;
  index: number;
  aspect?: string;
  frame?: "portrait" | "wide";
  sizes?: string;
  priority?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  // 3D Tilt motion values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(y, { stiffness: 320, damping: 24 });
  const rotateY = useSpring(x, { stiffness: 320, damping: 24 });

  // Counter-parallax motion for internal lens depth
  const mediaXRaw = useMotionValue(0);
  const mediaYRaw = useMotionValue(0);
  const mediaX = useSpring(mediaXRaw, { stiffness: 280, damping: 24 });
  const mediaY = useSpring(mediaYRaw, { stiffness: 280, damping: 24 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = (mouseX / width - 0.5) * 2;
    const yPct = (mouseY / height - 0.5) * 2;

    // 3D Viscous tilt angles
    x.set(xPct * 7.5);
    y.set(-yPct * 7.5);

    // Counter-parallax depth shift
    mediaXRaw.set(-xPct * 10);
    mediaYRaw.set(-yPct * 10);

    // Specular liquid sheen coordinates
    setGlare({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
      opacity: 0.28,
    });
  };

  const handleMouseEnter = () => {
    // hover activated
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    mediaXRaw.set(0);
    mediaYRaw.set(0);
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  const src = project.thumbnail || project.heroImage;
  const alt = `${project.title} — ${projectSubtitle(project)}`;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="perspective-1000 group relative block"
      style={{ perspective: 1200 }}
    >
      <Link href={`/work/${project.slug}`} data-cursor="view" className="block focus:outline-none md:cursor-none">
        <motion.div
          style={
            reduce
              ? undefined
              : {
                  rotateX,
                  rotateY,
                  transformStyle: "preserve-3d",
                }
          }
          transition={{ type: "spring", stiffness: 320, damping: 20 }}
          className="relative transition-transform duration-300"
        >
          {/* Main Visual Box */}
          <div
            className={`relative overflow-hidden rounded-sm bg-charcoal shadow-2xl transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.8)] group-hover:border-white/20 border border-white/5 liquid-gleam ${aspect}`}
          >
            {/* Image / Canvas with Counter-Parallax depth */}
            <motion.div
              style={reduce ? undefined : { x: mediaX, y: mediaY }}
              className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            >
              <ProjectMedia
                src={src}
                alt={alt}
                title={project.title}
                category={project.category}
                seed={project.order + index}
                frame={frame}
                priority={priority}
                sizes={sizes}
              />
            </motion.div>

            {/* Specular Liquid Lens Glare Overlay */}
            {!reduce && (
              <div
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: glare.opacity,
                  background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.5) 0%, rgba(0, 240, 255, 0.3) 25%, rgba(139, 92, 246, 0.15) 50%, transparent 70%)`,
                  mixBlendMode: "screen",
                }}
              />
            )}

            {/* Dark vignette overlay on hover */}
            <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/40" />

            {/* Top Category Badge */}
            <div className="pointer-events-none absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="rounded-full border border-white/15 bg-ink/75 px-3 py-1 font-display text-[10px] font-medium tracking-[0.2em] text-cream/90 backdrop-blur-md uppercase">
                {project.category}
              </span>
            </div>

            {/* Top Index Badge */}
            <div className="pointer-events-none absolute top-4 right-4 z-10">
              <span className="font-display text-[11px] font-semibold tracking-[0.2em] text-gold/80 drop-shadow">
                {pad(index + 1)}
              </span>
            </div>

            {/* Bottom Bar: Action prompt */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between p-5 opacity-0 transition-all duration-300 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1.5 font-display text-[10px] font-semibold tracking-[0.22em] text-ink uppercase shadow-lg">
                <span>VIEW CASE STUDY</span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </span>
              <span className="text-[11px] tracking-[0.18em] text-cream/70 font-mono">
                {project.year}
              </span>
            </div>
          </div>

          {/* Project Details Below Card */}
          <div className="mt-5 flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <h3 className="font-display text-2xl font-medium tracking-tight text-cream transition-colors duration-300 group-hover:text-gold md:text-3xl uppercase">
                  {project.title}
                </h3>
                <span className="inline-block text-gold opacity-0 transition-all duration-300 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0">
                  ↗
                </span>
              </div>
              <p className="text-sm leading-relaxed text-cream/65 line-clamp-1">
                {projectSubtitle(project)}
              </p>
              {project.services && project.services.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.services.slice(0, 3).map((svc) => (
                    <span
                      key={svc}
                      className="text-[11px] tracking-wider text-cream/45 uppercase"
                    >
                      #{svc}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              <span className="block font-mono text-xs text-cream/50">{project.client}</span>
              <span className="block font-mono text-[11px] text-gold/70">{project.year}</span>
            </div>
          </div>
        </motion.div>
      </Link>
    </div>
  );
}
