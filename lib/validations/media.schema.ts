import { z } from "zod";

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export const mediaUploadSchema = z.object({
  folder: z.string().optional(),
  alt: z.string().optional(),
  title: z.string().optional(),
});

export const mediaUpdateSchema = z.object({
  alt: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  folder: z.string().optional().nullable(),
});

export const mediaImportUrlSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  fileName: z.string().optional(),
  alt: z.string().optional(),
  title: z.string().optional(),
  folder: z.string().optional(),
});

export const mediaListQuerySchema = z.object({
  search: z.string().optional(),
  folder: z.string().optional(),
  mimeType: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(24),
  sort: z.enum(["newest", "oldest", "name", "size"]).default("newest"),
});

export function validateFileType(mimeType: string): boolean {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mimeType);
}

export function validateFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE;
}
