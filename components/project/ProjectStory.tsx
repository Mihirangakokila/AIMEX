import Link from "next/link";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { pad, projectSubtitle } from "@/lib/utils";
import type { Project } from "@/lib/types";

const gallerySpans = [
  "col-span-12",
  "col-span-12 md:col-span-7",
  "col-span-12 md:col-span-5",
  "col-span-6",
  "col-span-6",
  "col-span-12 md:col-span-8 md:col-start-3",
];

const galleryAspects = [
  "aspect-[16/9]",
  "aspect-[4/5] md:min-h-[70vh]",
  "aspect-[4/5] md:min-h-[70vh]",
  "aspect-[3/4]",
  "aspect-[3/4]",
  "aspect-[16/10]",
];

export function ProjectStory({
  project,
  index,
  previous,
  next,
}: {
  project: Project;
  index: number;
  previous?: Project;
  next?: Project;
}) {
  const hero = project.heroImage || project.thumbnail;
  const frames =
    project.gallery.length > 0
      ? project.gallery.map((image, frameIndex) => ({
          key: `${image.url}-${frameIndex}`,
          src: image.url,
          alt: image.alt || `${project.title} — image ${frameIndex + 1}`,
          seed: project.order + frameIndex + 1,
        }))
      : Array.from({ length: 5 }, (_, frameIndex) => ({
          key: `frame-${frameIndex}`,
          src: "",
          alt: `${project.title} — ${project.category.toLowerCase()} frame ${frameIndex + 1}`,
          seed: project.order + frameIndex + 3,
        }));

  return (
    <article>
      <header className="px-5 pb-10 pt-32 md:px-10 md:pt-40 lg:px-14">
        <Link href="/work" className="text-[11px] tracking-[0.22em] text-gold hover:text-gold-soft">
          ← ALL WORK
        </Link>
        <p className="mt-8 text-[11px] tracking-[0.28em] text-gold">
          {pad(index + 1)} — {project.category}
        </p>
        <h1 className="mt-4 max-w-5xl font-display text-[clamp(3.5rem,8vw,7.5rem)] font-medium uppercase leading-[0.88] tracking-[-0.045em]">
          {project.title}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-cream/75">{project.shortDescription}</p>
        <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-white/10 pt-6 md:grid-cols-4">
          <Meta label="Client" value={project.client} />
          <Meta label="Year" value={project.year} />
          <Meta label="Category" value={projectSubtitle(project)} />
          <Meta label="Services" value={project.services.join(", ") || project.category} />
        </dl>
      </header>

      <div className="relative aspect-[4/5] w-full bg-charcoal sm:aspect-[16/9] lg:aspect-[21/9]">
        <ProjectMedia
          src={hero}
          alt={`${project.title} hero`}
          title={project.title}
          category={project.category}
          seed={project.order}
          frame="wide"
          priority
          sizes="100vw"
        />
      </div>

      <section className="grid gap-8 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-12 lg:px-14">
        <h2 className="text-[11px] tracking-[0.28em] text-gold lg:col-span-4">PROJECT OVERVIEW</h2>
        <div className="max-w-2xl whitespace-pre-line text-lg leading-relaxed text-cream/80 lg:col-span-7 lg:col-start-6">
          {project.description}
        </div>
      </section>

      {project.services.length > 0 && (
        <section className="px-5 pb-8 md:px-10 lg:px-14">
          <h2 className="text-[11px] tracking-[0.28em] text-gold">SERVICES</h2>
          <ul className="mt-6 border-t border-white/10">
            {project.services.map((service, serviceIndex) => (
              <li
                key={service}
                className="flex items-baseline justify-between gap-6 border-b border-white/10 py-5"
              >
                <span className="text-[11px] tracking-[0.22em] text-gold">{pad(serviceIndex + 1)}</span>
                <span className="font-display text-2xl uppercase tracking-tight md:text-4xl">{service}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="grid grid-cols-12 gap-3 px-3 py-12 md:gap-5 md:px-8 md:py-20" aria-label="Project gallery">
        {frames.map((frame, frameIndex) => (
          <figure key={frame.key} className={gallerySpans[frameIndex % gallerySpans.length]}>
            <div className={`relative overflow-hidden bg-charcoal ${galleryAspects[frameIndex % galleryAspects.length]}`}>
              <ProjectMedia
                src={frame.src}
                alt={frame.alt}
                title={project.title}
                category={project.category}
                seed={frame.seed}
                frame={frameIndex % 5 === 0 ? "wide" : "portrait"}
                sizes="(max-width: 768px) 100vw, 70vw"
              />
            </div>
          </figure>
        ))}
      </section>

      {project.videoUrl && (
        <section className="px-5 pb-20 md:px-10 lg:px-14">
          <h2 className="mb-6 text-[11px] tracking-[0.28em] text-gold">FILM</h2>
          <VideoBlock url={project.videoUrl} title={project.title} />
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-6 px-5 py-10 md:px-10 lg:px-14">
        <p className="text-cream/70">Have a project in mind?</p>
        <ButtonLink href="/contact" variant="line">
          Start a project
        </ButtonLink>
      </div>

      {previous && next && (
        <nav className="grid border-t border-white/10 md:grid-cols-2" aria-label="More projects">
          <Link href={`/work/${previous.slug}`} className="border-b border-white/10 px-5 py-10 transition-colors hover:text-gold md:border-r md:border-b-0 md:px-10 lg:px-14">
            <span className="text-[11px] tracking-[0.22em] text-gold">PREVIOUS PROJECT</span>
            <span className="mt-3 block font-display text-3xl uppercase md:text-4xl">{previous.title}</span>
          </Link>
          <Link href={`/work/${next.slug}`} className="px-5 py-10 transition-colors hover:text-gold md:px-10 md:text-right lg:px-14">
            <span className="text-[11px] tracking-[0.22em] text-gold">NEXT PROJECT</span>
            <span className="mt-3 block font-display text-3xl uppercase md:text-4xl">{next.title}</span>
          </Link>
        </nav>
      )}
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-[0.22em] text-gold">{label.toUpperCase()}</dt>
      <dd className="mt-2 text-cream/85">{value}</dd>
    </div>
  );
}

function VideoBlock({ url, title }: { url: string; title: string }) {
  const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);

  if (youtube) {
    return (
      <div className="relative aspect-video w-full bg-black">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtube[1]}`}
          title={`${title} video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (vimeo) {
    return (
      <div className="relative aspect-video w-full bg-black">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://player.vimeo.com/video/${vimeo[1]}`}
          title={`${title} video`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <video className="aspect-video w-full bg-black" controls playsInline preload="metadata">
      <source src={url} />
    </video>
  );
}
