export const categories = ["WEB", "BRANDING", "PHOTOGRAPHY", "VIDEO", "SOCIAL"] as const;

export type Category = (typeof categories)[number];

export const inquiryStatuses = ["NEW", "CONTACTED", "COMPLETED"] as const;

export type InquiryStatus = (typeof inquiryStatuses)[number];

export type GalleryImage = {
  url: string;
  alt: string;
};

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: Category;
  year: string;
  client: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  heroImage: string;
  gallery: GalleryImage[];
  videoUrl: string;
  services: string[];
  featured: boolean;
  published: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
};

export type ActionState = {
  ok: boolean;
  error?: string;
  message?: string;
};
