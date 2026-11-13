"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

function subscribePointer(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getPointerSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

function getPointerServerSnapshot() {
  return false;
}

export function CustomCursor() {
  const isFinePointer = useSyncExternalStore(subscribePointer, getPointerSnapshot, getPointerServerSnapshot);
  const [visible, setVisible] = useState(false);
  const [cursorType, setCursorType] = useState<"default" | "pointer" | "view">("default");
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the cursor follower
  const springX = useSpring(mouseX, { stiffness: 450, damping: 28, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 28, mass: 0.5 });

  useEffect(() => {
    if (!isFinePointer) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);

      // Broadcast normalized cursor coordinates for magnetic fluid background attraction
      if (typeof window !== "undefined") {
        const normX = ((e.clientX / window.innerWidth) - 0.5) * 2;
        const normY = ((e.clientY / window.innerHeight) - 0.5) * 2;
        document.documentElement.style.setProperty("--cursor-norm-x", normX.toFixed(3));
        document.documentElement.style.setProperty("--cursor-norm-y", normY.toFixed(3));
      }

      // Determine what element is under the cursor
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorTarget) {
        const type = cursorTarget.getAttribute("data-cursor");
        if (type === "view") {
          setCursorType("view");
          return;
        }
      }

      const interactive = target.closest("button, a, input, textarea, [role='button']");
      if (interactive) {
        setCursorType("pointer");
      } else {
        setCursorType("default");
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      const id = Date.now();
      setRipples((prev) => [...prev.slice(-3), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 700);
    };

    const onMouseLeave = () => setVisible(false);
    const onMouseEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [mouseX, mouseY, isFinePointer]);

  if (!isFinePointer || !visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {/* Click Liquid Ripple Waves */}
      {ripples.map((rip) => (
        <motion.div
          key={rip.id}
          initial={{ scale: 0.3, opacity: 0.8 }}
          animate={{ scale: 2.8, opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ left: rip.x, top: rip.y }}
          className="fixed -ml-6 -mt-6 h-12 w-12 rounded-full border border-gold/70 shadow-[0_0_20px_rgba(0,240,255,0.4)] pointer-events-none"
        />
      ))}

      {/* Small dot pinned directly to mouse */}
      {cursorType === "default" && (
        <motion.div
          style={{ x: mouseX, y: mouseY }}
          className="fixed top-0 left-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-gold shadow-[0_0_8px_rgba(0,240,255,0.6)]"
          transition={{ duration: 0 }}
        />
      )}

      {/* Dynamic follower container with Viscous Liquid Rings */}
      <motion.div
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        className="fixed top-0 left-0 flex items-center justify-center pointer-events-none"
      >
        {cursorType === "default" && (
          <motion.div
            layoutId="cursorFollower"
            className="h-9 w-9 rounded-full border border-gold/45 bg-gold/[0.04] shadow-[0_0_14px_rgba(0,240,255,0.25),inset_0_0_8px_rgba(0,240,255,0.12)] backdrop-blur-[1px]"
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        )}

        {cursorType === "pointer" && (
          <motion.div
            layoutId="cursorFollower"
            className="h-12 w-12 rounded-full border border-gold/80 bg-gold/15 shadow-[0_0_22px_rgba(0,240,255,0.45),inset_0_0_12px_rgba(0,240,255,0.22)]"
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        )}

        {cursorType === "view" && (
          <motion.div
            layoutId="cursorFollower"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 24 }}
            className="flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 font-display text-[10px] font-semibold tracking-[0.22em] text-ink shadow-[0_10px_30px_rgba(0,240,255,0.4)] uppercase"
          >
            <span>EXPLORE</span>
            <span className="text-xs">↗</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
