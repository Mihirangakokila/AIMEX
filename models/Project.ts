import mongoose, { Schema } from "mongoose";
import { categories } from "@/lib/types";

const GalleryImageSchema = new Schema(
  {
    url: { type: String, required: true },
    alt: { type: String, default: "" },
  },
  { _id: false },
);

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    category: { type: String, enum: categories, required: true },
    year: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    gallery: { type: [GalleryImageSchema], default: [] },
    videoUrl: { type: String, default: "" },
    services: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ProjectSchema.index({ published: 1, order: 1 });
ProjectSchema.index({ featured: 1, order: 1 });

export const ProjectModel = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
