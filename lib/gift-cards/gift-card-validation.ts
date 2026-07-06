import sanitizeHtml from "sanitize-html";
import { z } from "zod";

const email = z.string().trim().email().max(160).transform((value) => value.toLowerCase());
const name = z.string().trim().min(1).max(100);
const optionalText = (max: number) =>
  z.string().trim().max(max).optional().transform((value) => value || "");

export const createGiftCardPurchaseSchema = z.object({
  type: z.enum(["AMOUNT", "SERVICE"]),
  amount: z.number().int().min(25).max(500).optional(),
  serviceId: z.string().trim().min(1).optional(),
  recipientName: name,
  recipientEmail: email,
  senderName: name,
  senderEmail: email,
  message: z.string().trim().min(1).max(280),
  termsAccepted: z.literal(true),
});

export const purchaseIdSchema = z.object({
  purchaseId: z.string().trim().min(1),
});

export const captureOrderSchema = z.object({
  purchaseId: z.string().trim().min(1),
  paypalOrderId: z.string().trim().min(1),
});

export const balanceCheckSchema = z.object({
  code: z.string().trim().min(12).max(40),
  recipientEmail: email,
});

export const adminGiftCardActionSchema = z.object({
  amount: z.number().min(0).optional(),
  note: z.string().trim().max(500).optional(),
  bookingId: z.string().trim().optional(),
});

export const createManualGiftCardSchema = z.object({
  type: z.enum(["AMOUNT", "SERVICE"]),
  amount: z.coerce.number().int().positive().optional(),
  serviceId: z.string().trim().min(1).optional(),
  recipientName: name,
  recipientEmail: email,
  senderName: name,
  senderEmail: email,
  message: optionalText(280),
  internalNote: optionalText(500),
  sendEmail: z.boolean(),
});

export function cleanGiftCardMessage(message: string, maxLength = 280) {
  return sanitizeHtml(message, {
    allowedTags: [],
    allowedAttributes: {},
  }).slice(0, maxLength);
}
