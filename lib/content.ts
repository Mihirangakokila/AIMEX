import type { Category } from "@/lib/types";

export const filters = ["ALL", "WEB", "BRANDING", "PHOTOGRAPHY", "VIDEO", "SOCIAL"] as const;

export type Filter = (typeof filters)[number];

export const serviceOptions = [
  "Website Design & Development",
  "Branding & Graphic Design",
  "Photography",
  "Videography",
  "Social Media Marketing",
  "Promotional Videos",
  "Social Media Content",
  "Creative Direction",
] as const;

export const projectTypes = [
  "Website Design & Development",
  "Branding & Graphic Design",
  "Photography",
  "Videography",
  "Social Media Marketing",
  "Promotional Video",
  "Social Media Content",
  "Full Agency Retainer",
  "Other",
] as const;

export const offerings: {
  number: string;
  title: string;
  description: string;
  category: Category;
  seed: number;
}[] = [
  {
    number: "01",
    title: "Website Design & Development",
    description: "Bespoke digital platforms, high-performance websites and interactive digital experiences crafted with uncompromising attention to detail.",
    category: "WEB",
    seed: 2,
  },
  {
    number: "02",
    title: "Branding & Graphic Design",
    description: "Holistic identity systems, typography, art direction and visual guidelines that define how ambitious brands are recognized worldwide.",
    category: "BRANDING",
    seed: 1,
  },
  {
    number: "03",
    title: "Photography",
    description: "Editorial, product, commercial, and architectural photography that captures texture, light, and authentic atmosphere.",
    category: "PHOTOGRAPHY",
    seed: 4,
  },
  {
    number: "04",
    title: "Videography",
    description: "Cinematic brand films, commercial shoots, and moving imagery directed and edited to captivate and convert.",
    category: "VIDEO",
    seed: 6,
  },
  {
    number: "05",
    title: "Social Media Marketing",
    description: "Strategic campaign planning, paid performance creative, and organic growth strategies tailored to each platform's nuances.",
    category: "SOCIAL",
    seed: 8,
  },
  {
    number: "06",
    title: "Promotional Videos",
    description: "High-energy launch reels, product teasers, and high-converting advertisements engineered for maximum viewer retention.",
    category: "VIDEO",
    seed: 10,
  },
  {
    number: "07",
    title: "Social Media Content",
    description: "Repeatable, high-aesthetic content production pipelines for Instagram Reels, TikTok, and curated feed aesthetics.",
    category: "SOCIAL",
    seed: 11,
  },
];

export const pillars = [
  {
    title: "Creative Direction",
    text: "The conceptual foundation, aesthetic references, and design discipline that hold every project together.",
  },
  {
    title: "Digital Craft",
    text: "Web experiences and interactive interfaces built to look breathtaking, load instantly, and convert seamlessly.",
  },
  {
    title: "Visual Storytelling",
    text: "Cinematic photography and film that evoke emotion and leave an unforgettable mark on your audience.",
  },
  {
    title: "Social Growth",
    text: "Modern content systems and viral distribution that amplify your brand across current digital channels.",
  },
];

export const processSteps = [
  { number: "01", title: "Discover", text: "We understand your brand vision, target audience, and key commercial goals." },
  { number: "02", title: "Define", text: "We establish the creative direction, narrative arc, and project architecture." },
  { number: "03", title: "Create", text: "We design, shoot, develop, and produce every visual asset to perfection." },
  { number: "04", title: "Deliver", text: "We launch the live experience and deliver assets optimized for immediate impact." },
];
