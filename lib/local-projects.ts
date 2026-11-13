import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { sampleAsProjects } from "@/lib/sample-projects";
import type { Project } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "projects.json");

export async function readLocalProjects(): Promise<Project[]> {
  try {
    const raw = await readFile(FILE_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // If file doesn't exist, initialize with sample projects
    try {
      const defaults = sampleAsProjects();
      await writeLocalProjects(defaults);
      return defaults;
    } catch {
      // ignore
    }
  }
  return sampleAsProjects();
}

export async function writeLocalProjects(projects: Project[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(FILE_PATH, JSON.stringify(projects, null, 2), "utf-8");
}
