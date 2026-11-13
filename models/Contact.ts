import mongoose, { Schema } from "mongoose";
import { inquiryStatuses } from "@/lib/types";

const ContactSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    company: { type: String, default: "" },
    projectType: { type: String, required: true },
    budget: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: inquiryStatuses, default: "NEW" },
  },
  { timestamps: true },
);

ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ status: 1, createdAt: -1 });

export const ContactModel = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
