import Image from "next/image";
import { ProjectVisual } from "@/components/visuals/ProjectVisual";
import type { Category } from "@/lib/types";

export function ProjectMedia({
  src,
  alt,
  title,
  category,
  seed,
  frame = "portrait",
  priority = false,
  sizes,
}: {
  src?: string;
  alt: string;
  title: string;
  category: Category;
  seed: number;
  frame?: "portrait" | "wide";
  priority?: boolean;
  sizes: string;
}) {
  if (src && src.startsWith("/") && !src.startsWith("//")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    );
  }

  if (src) {
    return (
      // External files are loaded by the browser. The server does not fetch arbitrary hosts.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    <div role="img" aria-label={alt} className="absolute inset-0">
      <ProjectVisual title={title} category={category} seed={seed} frame={frame} />
    </div>
  );
}
