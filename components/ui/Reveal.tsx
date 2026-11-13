"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function LineReveal({
  lines,
  className,
  goldIndex,
}: {
  lines: string[];
  className?: string;
  goldIndex?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <h1 className={className}>
      {lines.map((line, index) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className={cn("block", index === goldIndex && "text-gold")}
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.9, delay: 0.08 * index, ease: [0.22, 1, 0.36, 1] }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
