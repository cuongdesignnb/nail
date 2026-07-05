import { z } from "zod";

export const quoteRequestSchema = z.object({
  serviceIds: z.array(z.string()).min(1),
  addonIds: z.array(z.string()).default([]),
  promotionCode: z.string().optional().default(""),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  technicianId: z.string().optional(),
});

export const availabilityRequestSchema = z.object({
  serviceIds: z.array(z.string()).min(1),
  addonIds: z.array(z.string()).default([]),
  technicianId: z.string().optional().default("no-preference"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const createCheckoutSchema = z.object({
  serviceIds: z.array(z.string()).min(1),
  addonIds: z.array(z.string()).default([]),
  technicianId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  promotionCode: z.string().optional().default(""),
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(7),
    reminderConsent: z.boolean().default(true),
    marketingConsent: z.boolean().default(false),
  }),
  notes: z.string().optional().default(""),
  policyAccepted: z.literal(true),
  policyVersion: z.string().min(1).default("current-policy-version"),
});

export const captureCheckoutSchema = z.object({
  paypalOrderId: z.string().min(1),
});
