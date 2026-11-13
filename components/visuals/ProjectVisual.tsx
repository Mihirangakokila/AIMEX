import { useId } from "react";
import type { Category } from "@/lib/types";

type Tone = {
  base: string;
  panel: string;
  ink: string;
  gold: string;
  line: string;
};

const tones: Tone[] = [
  { base: "#060810", panel: "#0C101D", ink: "#F8FAFC", gold: "#00F0FF", line: "rgba(0,240,255,0.25)" },
  { base: "#080B14", panel: "#0F1424", ink: "#F1F5F9", gold: "#38BDF8", line: "rgba(56,189,248,0.22)" },
  { base: "#05070D", panel: "#0B0E1B", ink: "#FFFFFF", gold: "#00F0FF", line: "rgba(0,240,255,0.35)" },
  { base: "#0A0D18", panel: "#12172A", ink: "#F8FAFC", gold: "#60A5FA", line: "rgba(255,255,255,0.12)" },
];

function linesOf(title: string) {
  const words = title.trim().split(/\s+/);
  if (words.length <= 2) return words;
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}

export function ProjectVisual({
  title,
  category,
  seed,
  frame = "portrait",
}: {
  title: string;
  category: Category;
  seed: number;
  frame?: "portrait" | "wide";
}) {
  const tone = tones[Math.abs(seed) % tones.length];
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const viewBox = frame === "wide" ? "0 0 1600 900" : "0 0 900 1200";

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full font-display"
      aria-hidden
    >
      <defs>
        <filter id={`grain-${uid}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
        </filter>
      </defs>

      {category === "WEB" ? (
        <WebPlate title={title} tone={tone} wide={frame === "wide"} />
      ) : category === "PHOTOGRAPHY" ? (
        <PhotoPlate title={title} tone={tone} wide={frame === "wide"} />
      ) : category === "VIDEO" ? (
        <FilmPlate title={title} tone={tone} wide={frame === "wide"} />
      ) : category === "SOCIAL" ? (
        <SocialPlate title={title} tone={tone} wide={frame === "wide"} />
      ) : (
        <BrandPlate title={title} tone={tone} seed={seed} wide={frame === "wide"} />
      )}

      {/* Subtle Grain Filter */}
      <rect width="100%" height="100%" filter={`url(#grain-${uid})`} opacity="0.08" />
    </svg>
  );
}

function BrandPlate({ title, tone, seed, wide }: { title: string; tone: Tone; seed: number; wide: boolean }) {
  const words = linesOf(title);
  const x = wide ? 180 : 90;
  const y = wide ? 390 : 560;

  return (
    <g>
      <rect width="100%" height="100%" fill={tone.base} />
      <rect x={wide ? 80 : 48} y={wide ? 56 : 48} width={wide ? 1440 : 804} height={wide ? 788 : 1104} fill="none" stroke={tone.line} />
      <circle cx={wide ? 1280 : 700} cy={wide ? 210 : 240} r={wide ? 90 : 78} fill="none" stroke={tone.gold} strokeWidth="1.5" />
      <text x={wide ? 1280 : 700} y={wide ? 222 : 252} textAnchor="middle" fill={tone.gold} fontSize="42">
        {title.slice(0, 1)}
      </text>
      <text x={x} y={wide ? 150 : 160} fill={tone.gold} fontSize="16" letterSpacing="6">
        BRAND IDENTITY
      </text>
      {words.map((word, index) => (
        <text key={word} x={x} y={y + index * (wide ? 92 : 100)} fill={tone.ink} fontSize={title.length > 12 ? 68 : 84} fontWeight="medium">
          {word.toUpperCase()}
        </text>
      ))}
      <line x1={x} y1={y + words.length * (wide ? 84 : 92)} x2={x + 180} y2={y + words.length * (wide ? 84 : 92)} stroke={tone.gold} strokeWidth="2" />
      <text x={x} y={wide ? 780 : 1080} fill={tone.ink} opacity="0.7" fontSize="15" letterSpacing="5">
        {String(seed).padStart(2, "0")} / AIMEX
      </text>
    </g>
  );
}

function WebPlate({ title, tone, wide }: { title: string; tone: Tone; wide: boolean }) {
  const frame = wide ? { x: 120, y: 90, w: 1360, h: 720 } : { x: 70, y: 150, w: 760, h: 900 };

  return (
    <g>
      <rect width="100%" height="100%" fill={tone.base} />
      <rect x={frame.x} y={frame.y} width={frame.w} height={frame.h} fill={tone.panel} stroke={tone.line} strokeWidth="1" />
      <rect x={frame.x} y={frame.y} width={frame.w} height="46" fill={tone.base} />
      <circle cx={frame.x + 28} cy={frame.y + 23} r="5" fill={tone.gold} />
      <circle cx={frame.x + 48} cy={frame.y + 23} r="5" fill={tone.line} />
      <circle cx={frame.x + 68} cy={frame.y + 23} r="5" fill={tone.line} />
      <text x={frame.x + 96} y={frame.y + 28} fill={tone.ink} opacity="0.55" fontSize="14" letterSpacing="2">
        {title.toLowerCase()}.com
      </text>
      <rect x={frame.x + 28} y={frame.y + 78} width={frame.w * 0.46} height={frame.h * 0.62} fill={tone.base} />
      <rect x={frame.x + frame.w * 0.54} y={frame.y + 78} width={frame.w * 0.38} height="18" fill={tone.gold} />
      <rect x={frame.x + frame.w * 0.54} y={frame.y + 114} width={frame.w * 0.3} height="10" fill={tone.ink} opacity="0.35" />
      <rect x={frame.x + frame.w * 0.54} y={frame.y + 136} width={frame.w * 0.34} height="10" fill={tone.ink} opacity="0.2" />
      <rect x={frame.x + frame.w * 0.54} y={frame.y + 170} width={frame.w * 0.22} height="36" fill="none" stroke={tone.gold} />
      <text x={frame.x + 48} y={frame.y + frame.h - 48} fill={tone.ink} fontSize={wide ? 42 : 36}>
        {title.toUpperCase()}
      </text>
    </g>
  );
}

function PhotoPlate({ title, tone, wide }: { title: string; tone: Tone; wide: boolean }) {
  return (
    <g>
      <rect width="100%" height="100%" fill={tone.base} />
      <rect x={wide ? 160 : 80} y={wide ? 70 : 90} width={wide ? 1280 : 740} height={wide ? 760 : 1020} fill={tone.panel} />
      <rect x={wide ? 220 : 130} y={wide ? 120 : 150} width={wide ? 1160 : 640} height={wide ? 620 : 820} fill={tone.base} />
      
      {/* Editorial framing */}
      <circle cx={wide ? 1000 : 540} cy={wide ? 320 : 440} r={wide ? 100 : 120} fill={tone.gold} opacity="0.75" />
      <rect x={wide ? 420 : 250} y={wide ? 250 : 360} width={wide ? 70 : 84} height={wide ? 490 : 610} fill={tone.panel} opacity="0.8" />
      
      {/* Precision crop marks */}
      <line x1={wide ? 200 : 110} y1={wide ? 100 : 130} x2={wide ? 240 : 150} y2={wide ? 100 : 130} stroke={tone.gold} strokeWidth="1.5" />
      <line x1={wide ? 200 : 110} y1={wide ? 100 : 130} x2={wide ? 200 : 110} y2={wide ? 140 : 170} stroke={tone.gold} strokeWidth="1.5" />
      
      <text x={wide ? 220 : 130} y={wide ? 800 : 1080} fill={tone.ink} fontSize="16" letterSpacing="4">
        {`${title.toUpperCase()} — EDITORIAL`}
      </text>
    </g>
  );
}

function FilmPlate({ title, tone, wide }: { title: string; tone: Tone; wide: boolean }) {
  const cx = wide ? 800 : 450;
  const cy = wide ? 450 : 600;

  return (
    <g>
      <rect width="100%" height="100%" fill={tone.base} />
      {/* 2.39:1 Cinematic Letterbox */}
      <rect x={wide ? 100 : 40} y={wide ? 150 : 260} width={wide ? 1400 : 820} height={wide ? 600 : 680} fill={tone.panel} stroke={tone.line} strokeWidth="1" />
      
      {/* Timecode */}
      <text x={wide ? 140 : 80} y={wide ? 200 : 310} fill={tone.gold} fontSize="14" letterSpacing="3" fontFamily="monospace">
        {"REC [●] 00:04:18:22 // 4K CINEMATIC"}
      </text>

      {/* Play Icon */}
      <circle cx={cx} cy={cy} r={wide ? 54 : 48} fill="none" stroke={tone.gold} strokeWidth="1.5" />
      <polygon points={`${cx - 10},${cy - 18} ${cx + 18},${cy} ${cx - 10},${cy + 18}`} fill={tone.gold} />

      <text x={wide ? 140 : 80} y={wide ? 700 : 900} fill={tone.ink} fontSize={wide ? 48 : 36} fontWeight="medium">
        {title.toUpperCase()}
      </text>
    </g>
  );
}

function SocialPlate({ title, tone, wide }: { title: string; tone: Tone; wide: boolean }) {
  const frame = wide ? { x: 500, y: 70, w: 600, h: 760 } : { x: 120, y: 140, w: 660, h: 920 };

  return (
    <g>
      <rect width="100%" height="100%" fill={tone.base} />
      <rect x={frame.x} y={frame.y} width={frame.w} height={frame.h} rx="24" fill={tone.panel} stroke={tone.line} strokeWidth="1.5" />
      
      {/* Story / Reel header */}
      <circle cx={frame.x + 50} cy={frame.y + 50} r="16" fill={tone.gold} />
      <text x={frame.x + 80} y={frame.y + 55} fill={tone.ink} fontSize="14" letterSpacing="2">
        {"AIMEX // SOCIAL"}
      </text>
      
      <rect x={frame.x + 36} y={frame.y + 90} width={frame.w - 72} height={frame.h - 180} rx="12" fill={tone.base} />
      
      <text x={frame.x + 48} y={frame.y + frame.h - 40} fill={tone.ink} fontSize={28} fontWeight="medium">
        {title.toUpperCase()}
      </text>
    </g>
  );
}
