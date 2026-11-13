"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/actions/auth";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/projects/new", label: "Add project" },
  { href: "/admin/inquiries", label: "Inquiries" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink text-cream">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 md:hidden">
        <Logo />
        <button type="button" className="cursor-pointer text-[11px] tracking-[0.2em]" onClick={() => setOpen((value) => !value)}>
          {open ? "CLOSE" : "MENU"}
        </button>
      </div>
      <div className="md:flex">
        <aside
          className={cn(
            "border-white/10 md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-r md:px-6 md:py-8",
            open ? "block border-b px-5 py-6" : "hidden",
          )}
        >
          <Link href="/admin" className="hidden md:inline-flex">
            <Logo />
          </Link>
          <p className="mt-3 hidden text-[11px] tracking-[0.22em] text-cream/45 md:block">STUDIO</p>
          <nav className="mt-4 flex flex-col gap-1 md:mt-8" aria-label="Admin">
            {links.map((link) => {
              const active = isCurrent(link.href, pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn("px-2 py-2 text-sm", active ? "text-gold" : "text-cream/70 hover:text-cream")}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 flex flex-col gap-3 md:mt-auto">
            <Link href="/" className="px-2 text-sm text-cream/70 hover:text-gold">
              View site
            </Link>
            <form action={logout}>
              <button type="submit" className="cursor-pointer px-2 text-sm text-cream/70 hover:text-gold">
                Log out
              </button>
            </form>
          </div>
        </aside>
        <div className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-12">{children}</div>
      </div>
    </div>
  );
}

function isCurrent(href: string, pathname: string) {
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/projects") {
    return pathname === "/admin/projects" || (/^\/admin\/projects\/.+/.test(pathname) && pathname !== "/admin/projects/new");
  }
  return pathname === href;
}
