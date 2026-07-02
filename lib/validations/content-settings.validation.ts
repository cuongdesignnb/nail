import { z } from "zod";

const validPageKeys = [
  "home",
  "about",
  "services",
  "gallery",
  "packages",
  "booking",
  "contact",
  "global",
];

export const pageTestimonialSchema = z.object({
  pageKey: z
    .string()
    .min(1, "Page Key is required")
    .refine((val) => validPageKeys.includes(val), {
      message: "Invalid page selection key",
    }),
  name: z.string().min(1, "Client Name is required"),
  role: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
  avatarAlt: z.string().optional().nullable(),
  rating: z
    .union([z.number(), z.string()])
    .default(5)
    .transform((val) => {
      const num = Number(val);
      return num >= 1 && num <= 5 ? num : 5;
    }),
  quote: z.string().min(1, "Feedback quote is required"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const pageFaqSchema = z.object({
  pageKey: z
    .string()
    .min(1, "Page Key is required")
    .refine((val) => validPageKeys.includes(val), {
      message: "Invalid page selection key",
    }),
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const pageContentBlockSchema = z.object({
  pageKey: z
    .string()
    .min(1, "Page Key is required")
    .refine((val) => validPageKeys.includes(val), {
      message: "Invalid page selection key",
    }),
  sectionKey: z.string().min(1, "Section key is required"),
  blockKey: z.string().min(1, "Block key is required"),
  label: z.string().optional().nullable(),
  value: z.string().optional().nullable(),
  jsonValue: z.unknown().optional(),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});
