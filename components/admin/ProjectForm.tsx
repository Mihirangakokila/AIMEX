"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { saveProject } from "@/actions/projects";
import { ProjectMedia } from "@/components/media/ProjectMedia";
import { ImageCropModal } from "@/components/admin/ImageCropModal";
import { categories, type ActionState, type Category, type GalleryImage, type Project } from "@/lib/types";
import { serviceOptions } from "@/lib/content";
import { slugify } from "@/lib/utils";

const initialState: ActionState = { ok: false };

export function ProjectForm({ project }: { project?: Project }) {
  const [state, action, pending] = useActionState(saveProject, initialState);
  const [fileWarning, setFileWarning] = useState<string | null>(null);
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(project?.slug));
  const [category, setCategory] = useState<Category>(project?.category ?? "BRANDING");
  const [thumbnail, setThumbnail] = useState(project?.thumbnail ?? "");
  const [hero, setHero] = useState(project?.heroImage ?? "");
  const [gallery, setGallery] = useState<GalleryImage[]>(project?.gallery ?? []);

  return (
    <form action={action} className="max-w-3xl space-y-8">
      {project && <input type="hidden" name="id" value={project.id} />}
      <input type="hidden" name="existingGallery" value={JSON.stringify(gallery)} />

      <p className="max-w-xl text-sm leading-relaxed text-cream/65">
        Leave image fields empty to keep the studio placeholder. Upload photography, stills, mockups or posters when the
        real work is ready. Each file should be under 20MB.
      </p>

      <Field label="Title" name="title" value={title} required onChange={(value) => {
        setTitle(value);
        if (!slugEdited) setSlug(slugify(value));
      }} />
      <Field
        label="URL slug"
        name="slug"
        value={slug}
        required
        onChange={(value) => {
          setSlugEdited(true);
          setSlug(slugify(value));
        }}
        hint={slug ? `Public URL: /work/${slug}` : "This becomes the project link."}
      />
      <Field label="Client" name="client" defaultValue={project?.client ?? ""} required />
      <div className="grid gap-8 md:grid-cols-2">
        <Field label="Year" name="year" defaultValue={project?.year ?? "2026"} required />
        <label className="block">
          <span className="text-[11px] tracking-[0.22em] text-gold">CATEGORY</span>
          <select
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value as Category)}
            className="mt-2 w-full cursor-pointer border-b border-white/15 bg-transparent py-3 outline-none focus:border-gold"
          >
            {categories.map((item) => (
              <option key={item} value={item} className="bg-ink">
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Area label="Short description" name="shortDescription" defaultValue={project?.shortDescription ?? ""} required rows={3} />
      <Area label="Description" name="description" defaultValue={project?.description ?? ""} required rows={8} />

      <fieldset>
        <legend className="text-[11px] tracking-[0.22em] text-gold">SERVICES</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {serviceOptions.map((service) => (
            <label key={service} className="flex items-center gap-3 text-sm text-cream/80">
              <input
                type="checkbox"
                name="services"
                value={service}
                defaultChecked={project?.services.includes(service)}
                className="accent-gold"
              />
              {service}
            </label>
          ))}
        </div>
      </fieldset>

      <ImageField
        label="Thumbnail"
        name="thumbnail"
        fileName="thumbnailFile"
        value={thumbnail}
        onChange={setThumbnail}
        onFile={(file) => setThumbnail(URL.createObjectURL(file))}
        onOversize={setFileWarning}
        title={title || "Project"}
        category={category}
        autoOpenCropOnUpload={true}
      />
      <ImageField
        label="Hero image"
        name="heroImage"
        fileName="heroFile"
        value={hero}
        onChange={setHero}
        onFile={(file) => setHero(URL.createObjectURL(file))}
        onOversize={setFileWarning}
        title={title || "Project"}
        category={category}
      />

      <div>
        <p className="text-[11px] tracking-[0.22em] text-gold">GALLERY</p>
        {gallery.length > 0 && (
          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {gallery.map((image) => (
              <li key={image.url} className="border border-white/10 p-2">
                <div className="relative aspect-[4/3]">
                  <ProjectMedia src={image.url} alt={image.alt || title} title={title || "Project"} category={category} seed={1} sizes="200px" />
                </div>
                <button
                  type="button"
                  className="mt-2 cursor-pointer text-[11px] tracking-[0.16em] text-gold"
                  onClick={() => setGallery((items) => items.filter((item) => item.url !== image.url))}
                >
                  REMOVE
                </button>
              </li>
            ))}
          </ul>
        )}
        <label className="mt-4 block text-sm text-cream/70">
          Add image files (up to 20MB each)
          <input
            type="file"
            name="galleryFiles"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            multiple
            className="mt-2 block w-full text-sm"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              const oversize = files.find((f) => f.size > 20 * 1024 * 1024);
              if (oversize) {
                setFileWarning(`"${oversize.name}" is ${(oversize.size / 1024 / 1024).toFixed(1)}MB. Each image must be under 20MB.`);
                event.target.value = "";
              } else {
                setFileWarning(null);
              }
            }}
          />
        </label>
        <label className="mt-4 block">
          <span className="text-sm text-cream/70">Or paste image URLs, one per line</span>
          <textarea name="galleryUrls" rows={4} className="mt-2 w-full border-b border-white/15 bg-transparent py-3 outline-none focus:border-gold" />
        </label>
      </div>

      <Field label="Video URL" name="videoUrl" defaultValue={project?.videoUrl ?? ""} hint="MP4 link, YouTube or Vimeo. Optional." />
      <Field label="Display order" name="order" type="number" defaultValue={String(project?.order ?? 0)} />

      <div className="flex flex-wrap gap-8">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} className="accent-gold" />
          Featured on the homepage
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="published" defaultChecked={project?.published ?? true} className="accent-gold" />
          Published
        </label>
      </div>

      {(fileWarning || state.error) && (
        <p className="rounded border border-gold/40 bg-gold/10 p-3 text-sm text-gold" role="alert">
          {fileWarning || state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 cursor-pointer items-center bg-gold px-6 py-3 text-[11px] tracking-[0.22em] text-ink uppercase hover:bg-gold-soft disabled:opacity-70"
      >
        {pending ? "Saving..." : project ? "Save project" : "Create project"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  value,
  defaultValue,
  onChange,
  required,
  type = "text",
  hint,
}: {
  label: string;
  name: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.22em] text-gold">{label.toUpperCase()}</span>
      <input
        name={name}
        type={type}
        required={required}
        {...(onChange
          ? { value: value ?? "", onChange: (event) => onChange(event.target.value) }
          : { defaultValue })}
        className="mt-2 w-full border-b border-white/15 bg-transparent py-3 outline-none focus:border-gold"
      />
      {hint && <span className="mt-2 block text-xs text-cream/50">{hint}</span>}
    </label>
  );
}

function Area({
  label,
  name,
  defaultValue,
  required,
  rows,
}: {
  label: string;
  name: string;
  defaultValue: string;
  required?: boolean;
  rows: number;
}) {
  return (
    <label className="block">
      <span className="text-[11px] tracking-[0.22em] text-gold">{label.toUpperCase()}</span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        defaultValue={defaultValue}
        className="mt-2 w-full resize-y border-b border-white/15 bg-transparent py-3 outline-none focus:border-gold"
      />
    </label>
  );
}

function ImageField({
  label,
  name,
  fileName,
  value,
  onChange,
  onFile,
  onOversize,
  title,
  category,
  autoOpenCropOnUpload = false,
}: {
  label: string;
  name: string;
  fileName: string;
  value: string;
  onChange: (value: string) => void;
  onFile: (file: File) => void;
  onOversize?: (msg: string | null) => void;
  title: string;
  category: Category;
  autoOpenCropOnUpload?: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [croppedBadge, setCroppedBadge] = useState<string | null>(null);
  const [previewAspect, setPreviewAspect] = useState<"9/16" | "16/9">("16/9");

  const preview = value;

  // Automatically detect if the preview photo is portrait (height > width)
  useEffect(() => {
    if (!preview) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (img.naturalHeight > img.naturalWidth) {
        setPreviewAspect("9/16");
      } else {
        setPreviewAspect("16/9");
      }
    };
    img.src = preview;
  }, [preview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        onOversize?.(`"${file.name}" is ${(file.size / 1024 / 1024).toFixed(1)}MB. Max allowed size per image is 20MB.`);
        event.target.value = "";
        return;
      }
      onOversize?.(null);
      const url = URL.createObjectURL(file);
      onFile(file);
      onChange(url);
      setCroppedBadge(null);

      // Pre-detect orientation on upload
      const img = new Image();
      img.onload = () => {
        if (img.naturalHeight > img.naturalWidth) {
          setPreviewAspect("9/16");
        } else {
          setPreviewAspect("16/9");
        }
      };
      img.src = url;

      if (autoOpenCropOnUpload) {
        setIsCropOpen(true);
      }
    }
  };

  const handleCropApply = (croppedFile: File, previewUrl: string, ratio?: number) => {
    // Inject the newly cropped and adjusted file into the file input
    if (fileInputRef.current && typeof DataTransfer !== "undefined") {
      try {
        const dt = new DataTransfer();
        dt.items.add(croppedFile);
        fileInputRef.current.files = dt.files;
      } catch (err) {
        console.warn("DataTransfer update error:", err);
      }
    }
    onFile(croppedFile);
    onChange(previewUrl);

    if (ratio && ratio < 0.7) {
      setCroppedBadge("9:16 Portrait Cropped & Fixed");
      setPreviewAspect("9/16");
    } else {
      setCroppedBadge("Cropped & Enhanced");
      setPreviewAspect(ratio && ratio < 1 ? "9/16" : "16/9");
    }
  };

  return (
    <div>
      <label className="block">
        <span className="text-[11px] tracking-[0.22em] text-gold">{label.toUpperCase()}</span>
        <input
          name={name}
          value={value.startsWith("blob:") ? "" : value}
          onChange={(event) => {
            onChange(event.target.value);
            setCroppedBadge(null);
          }}
          placeholder="https:// or /uploads/..."
          className="mt-2 w-full border-b border-white/15 bg-transparent py-3 outline-none placeholder:text-cream/30 focus:border-gold"
        />
      </label>
      <label className="mt-3 block text-sm text-cream/70">
        Upload a file (up to 20MB)
        <input
          ref={fileInputRef}
          type="file"
          name={fileName}
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="mt-2 block w-full text-sm"
          onChange={handleFileChange}
        />
      </label>

      {preview && (
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-2.5">
            <button
              type="button"
              onClick={() => setIsCropOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/10 px-3.5 py-1.5 text-xs font-medium text-gold hover:bg-gold/20 hover:border-gold transition-all shadow-[0_0_12px_rgba(0,240,255,0.18)] cursor-pointer"
            >
              <span>✂️</span> Crop & Fix Photo
            </button>
            {croppedBadge && (
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-0.5">
                <span>✓</span> {croppedBadge}
              </span>
            )}
          </div>

          <div
            className={`relative overflow-hidden rounded-lg border border-white/10 shadow-sm transition-all duration-300 ${
              previewAspect === "9/16"
                ? "aspect-[9/16] max-w-[210px]"
                : "aspect-video max-w-sm"
            }`}
          >
            <ProjectMedia
              src={preview}
              alt={label}
              title={title}
              category={category}
              seed={2}
              frame={previewAspect === "9/16" ? "portrait" : "wide"}
              sizes="400px"
            />
          </div>
        </div>
      )}

      {preview && (
        <ImageCropModal
          isOpen={isCropOpen}
          imageSrc={preview}
          onClose={() => setIsCropOpen(false)}
          onApply={handleCropApply}
          title={`Crop & Fix ${label}`}
        />
      )}
    </div>
  );
}
