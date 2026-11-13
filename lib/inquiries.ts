import mongoose from "mongoose";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { connectDB } from "@/lib/db";
import { ContactModel } from "@/models/Contact";
import type { Inquiry, InquiryStatus } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

async function readLocalInquiries(): Promise<Inquiry[]> {
  try {
    const raw = await readFile(INQUIRIES_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {
    // file doesn't exist
  }
  return [];
}

async function writeLocalInquiries(inquiries: Inquiry[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
}

type InquiryDoc = {
  _id: { toString(): string };
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budget?: string;
  message: string;
  status: InquiryStatus;
  createdAt?: Date;
};

function serialize(doc: InquiryDoc): Inquiry {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    company: doc.company || "",
    projectType: doc.projectType,
    budget: doc.budget || "",
    message: doc.message,
    status: doc.status,
    createdAt: doc.createdAt?.toISOString() || new Date().toISOString(),
  };
}

export async function createInquiry(input: {
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
}) {
  try {
    await connectDB();
    await ContactModel.create({ ...input, status: "NEW" });
    return;
  } catch {
    // fallback to local file
  }

  const local = await readLocalInquiries();
  const newInquiry: Inquiry = {
    ...input,
    id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    status: "NEW",
    createdAt: new Date().toISOString(),
  };
  local.unshift(newInquiry);
  await writeLocalInquiries(local);
}

export async function getInquiries(): Promise<Inquiry[]> {
  try {
    await connectDB();
    const docs = (await ContactModel.find().sort({ createdAt: -1 }).lean()) as unknown as InquiryDoc[];
    return docs.map(serialize);
  } catch {
    return readLocalInquiries();
  }
}

export async function setInquiryStatus(id: string, status: InquiryStatus) {
  try {
    if (mongoose.isValidObjectId(id)) {
      await connectDB();
      await ContactModel.findByIdAndUpdate(id, { status });
      return;
    }
  } catch {
    // fallback
  }

  const local = await readLocalInquiries();
  const item = local.find((i) => i.id === id);
  if (item) {
    item.status = status;
    await writeLocalInquiries(local);
  }
}
