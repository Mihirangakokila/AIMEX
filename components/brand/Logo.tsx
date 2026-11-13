import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className, tone = "light" }: { className?: string; tone?: "light" | "gold" }) {
  const color = tone === "gold" ? "text-gold" : "text-cream";
  return (
    <span className={cn("inline-flex items-center gap-2.5 group", className)}>
      <svg
        className="h-6 w-6 shrink-0 text-gold filter drop-shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-transform duration-300 group-hover:scale-105"
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3.5 22.5 13.1 4.5l10.2 18M7.2 15.5h12.1M17.5 6.5h6v6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="13.2" cy="4.6" r="1.35" fill="currentColor" />
      </svg>
      <span className={cn("font-display text-[15px] font-semibold tracking-[0.2em] uppercase", color)}>
        AIMEX
      </span>
    </span>
  );
}

export function LogoLink({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex focus:outline-none", className)} aria-label="AIMEX home">
      <Logo />
    </Link>
  );
}
