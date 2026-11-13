import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const allowed = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/avif", "avif"],
]);

const maxBytes = 20 * 1024 * 1024;

export async function storeImage(file: File) {
  if (!file || file.size === 0) return "";
  if (file.size > maxBytes) {
    throw new Error("Each image must be under 20MB.");
  }
  const extension = allowed.get(file.type);
  if (!extension) {
    throw new Error("Use a JPG, PNG, WEBP, GIF or AVIF image.");
  }

  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(directory, name), buffer);
  return `/uploads/${name}`;
}
