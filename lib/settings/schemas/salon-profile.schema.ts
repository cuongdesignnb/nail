import { z } from "zod";

const optionalUrl = z.union([
  z.literal(""),
  z.string().trim().url("Enter a valid website URL."),
]);

export const salonProfileSchema = z.object({
  name: z.string().trim().min(1, "Salon name is required.").max(100),
  phone: z.string().trim().max(40).refine(
    (value) => !value || value.replace(/\D/g, "").length >= 7,
    "Enter a valid phone number.",
  ),
  email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address.")]),
  address: z.string().trim().max(300),
  website: optionalUrl,
  description: z.string().trim().max(3000),
});

export type SalonProfileInput = z.infer<typeof salonProfileSchema>;
