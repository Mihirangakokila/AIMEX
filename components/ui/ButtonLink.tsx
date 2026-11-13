import Link from "next/link";
import { cn } from "@/lib/utils";

const variants = {
  gold: "bg-gold text-ink font-semibold hover:bg-gold-soft shadow-[0_0_20px_var(--theme-glow)] rounded-full liquid-gleam",
  line: "border border-white/20 text-cream hover:border-gold hover:text-gold hover:shadow-[0_0_15px_var(--theme-glow)] rounded-full liquid-gleam",
};

export function ButtonLink({
  href,
  children,
  variant = "gold",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center px-6 py-3 text-[11px] font-medium uppercase tracking-[0.22em] transition-colors",
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  );
}
