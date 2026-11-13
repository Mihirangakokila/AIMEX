"use client";

import { useTheme } from "@/components/theme/ThemeProvider";
import { motion } from "framer-motion";
import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const isMounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!isMounted) {
    // Render placeholder with identical dimensions to prevent layout shifts
    return (
      <div className={`flex h-8 w-[136px] items-center rounded-full border border-white/10 bg-charcoal/60 p-0.5 ${className}`} />
    );
  }

  const options = [
    {
      id: "light" as const,
      label: "Light",
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden>
          <circle cx="10" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M10 2.5V4M10 16V17.5M2.5 10H4M16 10H17.5M4.7 4.7L5.8 5.8M14.2 14.2L15.3 15.3M4.7 15.3L5.8 14.2M14.2 5.8L15.3 4.7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      id: "dark" as const,
      label: "Dark",
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden>
          <path
            d="M14.8 12.3A6.2 6.2 0 017.7 5.2a6.3 6.3 0 107.1 7.1z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: "system" as const,
      label: "System (Default)",
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden>
          <rect x="3" y="3.5" width="14" height="9.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 16.5H13M10 13V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: "liquid" as const,
      label: "Liquid Glass",
      icon: (
        <svg viewBox="0 0 20 20" fill="none" className="h-3.5 w-3.5" aria-hidden>
          {/* Organic liquid droplet contour */}
          <path
            d="M10 2.5C10 2.5 4.5 9 4.5 13C4.5 16 7 18.2 10 18.2C13 18.2 15.5 16 15.5 13C15.5 9 10 2.5 10 2.5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="currentColor"
            fillOpacity="0.25"
          />
          {/* Specular curved liquid refraction sheen */}
          <path
            d="M7.4 12C7.4 9.6 8.8 7.2 10 5.4"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            opacity="0.9"
          />
          <circle cx="8" cy="14.3" r="0.85" fill="currentColor" opacity="0.9" />
        </svg>
      ),
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Theme selector"
      className={`relative flex items-center rounded-full border border-white/10 bg-charcoal/80 p-0.5 shadow-sm backdrop-blur-md transition-colors ${className}`}
    >
      {options.map((opt) => {
        const active = theme === opt.id || (opt.id === "liquid" && theme === "glass");
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={active}
            title={`${opt.label} theme`}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const origin = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
              };
              setTheme(opt.id, origin);
            }}
            className={`relative flex h-7 w-8 items-center justify-center rounded-full text-xs transition-colors duration-200 focus:outline-none ${
              active
                ? "text-ink font-semibold"
                : "text-cream/50 hover:text-cream"
            }`}
          >
            {active && (
              <motion.div
                layoutId="themeTogglePill"
                className="absolute inset-0 rounded-full bg-gold shadow-[0_0_16px_rgba(0,240,255,0.45)] overflow-hidden"
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 22,
                  mass: 0.75,
                }}
              >
                {/* Gelatinous liquid meniscus specular shine */}
                <span className="pointer-events-none absolute inset-x-1.5 top-0.5 h-1 rounded-full bg-white/40 blur-[0.4px]" />
              </motion.div>
            )}
            <span className="relative z-10">{opt.icon}</span>
          </button>
        );
      })}
    </div>
  );
}
