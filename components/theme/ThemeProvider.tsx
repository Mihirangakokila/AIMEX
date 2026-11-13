"use client";

import { createContext, useContext, useEffect, useState, useMemo, useSyncExternalStore } from "react";

export type Theme = "light" | "dark" | "system" | "liquid" | "glass";
export type ResolvedTheme = "light" | "dark" | "liquid";

export interface ThemeOrigin {
  x: number;
  y: number;
}

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme, origin?: ThemeOrigin) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "aimex-theme";

function subscribeSystemTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getSystemSnapshot(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getSystemServerSnapshot(): "dark" | "light" {
  return "dark";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemTheme = useSyncExternalStore(subscribeSystemTheme, getSystemSnapshot, getSystemServerSnapshot);

  // Lazy initialize theme from localStorage (defaults to 'system')
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (saved && (saved === "light" || saved === "dark" || saved === "system" || saved === "liquid" || saved === "glass")) {
        return saved === "glass" ? "liquid" : saved;
      }
    } catch {
      // ignore
    }
    return "system";
  });

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (theme === "system") return systemTheme;
    if (theme === "glass") return "liquid";
    return theme;
  }, [theme, systemTheme]);

  // Synchronize DOM with the resolved theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "liquid", "glass");
    if (resolvedTheme === "liquid") {
      root.classList.add("liquid", "glass");
      root.setAttribute("data-theme", "liquid");
      root.style.colorScheme = "dark";
    } else {
      root.classList.add(resolvedTheme);
      root.setAttribute("data-theme", resolvedTheme);
      root.style.colorScheme = resolvedTheme;
    }
  }, [resolvedTheme]);

  const setTheme = (newTheme: Theme, origin?: ThemeOrigin) => {
    const apply = () => {
      setThemeState(newTheme);
      try {
        localStorage.setItem(STORAGE_KEY, newTheme);
      } catch {
        // ignore
      }
    };

    // If View Transitions are not available or user prefers reduced motion, apply immediately
    if (
      typeof document === "undefined" ||
      !("startViewTransition" in document) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      apply();
      return;
    }

    // Radial liquid ink-drop wave transition from click origin
    const x = origin?.x ?? window.innerWidth - 80;
    const y = origin?.y ?? 40;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const doc = document as Document & {
      startViewTransition?: (callback: () => void) => { ready: Promise<void> };
    };

    if (typeof doc.startViewTransition === "function") {
      const transition = doc.startViewTransition(() => {
        apply();
      });

      transition.ready
        ?.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 650,
              easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              pseudoElement: "::view-transition-new(root)",
            },
          );
        })
        .catch(() => {
          // ignore animation failures gracefully
        });
    } else {
      apply();
    }
  };

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
    }),
    [theme, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
