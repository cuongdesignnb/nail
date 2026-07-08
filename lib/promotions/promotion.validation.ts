import { z } from "zod";

export const promotionClaimSchema = z.object({
  fullName: z.string().trim().min(1, "Please enter your full name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(160).transform((v) => v.toLowerCase()),
  phone: z.string().trim().min(7, "Please enter a valid phone number.").max(30).regex(/^[0-9+\-().\s]+$/, "Please enter a valid phone number."),
  consentAccepted: z.literal(true, { message: "Please agree to receive this offer by email." }),
  sourcePage: z.string().trim().max(200).optional(),
});

export const promotionCampaignSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(180),
  subtitle: z.string().trim().max(220).optional().nullable(),
  eyebrow: z.string().trim().max(80).optional().nullable(),
  badge: z.string().trim().max(40).optional().nullable(),
  description: z.string().trim().max(1200).optional().nullable(),
  policyNote: z.string().trim().max(500).optional().nullable(),
  ctaLabel: z.string().trim().min(1, "CTA label is required.").max(60),
  imageUrl: z.string().trim().max(500).optional().nullable(),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "EXPIRED"]).default("DRAFT"),
  displayLocation: z.enum(["HOMEPAGE", "PROMOTIONS_PAGE", "POPUP", "ALL"]).default("HOMEPAGE"),
  showOnHomepage: z.boolean().default(true),
  popupEnabled: z.boolean().default(false),
  triggerType: z.enum(["SCROLL_PERCENT", "SECTION_VISIBLE", "DELAY_ONLY"]).default("SCROLL_PERCENT"),
  scrollPercent: z.coerce.number().int().min(10).max(90).default(40),
  delaySeconds: z.coerce.number().int().min(0).max(30).default(3),
  frequencyHours: z.coerce.number().int().min(1).max(720).default(24),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  voucher: z.object({
    discountType: z.enum(["PERCENT", "FIXED_AMOUNT", "FREE_ADDON", "CUSTOM"]).default("PERCENT"),
    discountValue: z.coerce.number().positive().optional().nullable(),
    codePrefix: z.string().trim().min(2).max(32).regex(/^[A-Z0-9-]+$/, "Use uppercase letters, numbers and dashes only."),
    expiresInDays: z.coerce.number().int().min(1).max(365).default(14),
    usageLimit: z.coerce.number().int().min(1).default(1),
    perCustomerLimit: z.coerce.number().int().min(1).default(1),
    minimumSpend: z.coerce.number().positive().optional().nullable(),
  }),
  email: z.object({
    subject: z.string().trim().min(1).max(180).default("Your Aera Nail Lounge Voucher Is Here"),
    preheader: z.string().trim().max(220).optional().nullable(),
    bodyHtml: z.string().trim().min(1),
    bodyText: z.string().trim().optional().nullable(),
    buttonLabel: z.string().trim().max(80).optional().nullable(),
    buttonUrl: z.string().trim().max(500).optional().nullable(),
  }),
}).superRefine((value, ctx) => {
  if ((value.voucher.discountType === "PERCENT" || value.voucher.discountType === "FIXED_AMOUNT") && !value.voucher.discountValue) {
    ctx.addIssue({ code: "custom", path: ["voucher", "discountValue"], message: "Discount value is required." });
  }
  if (value.voucher.discountType === "PERCENT" && value.voucher.discountValue && value.voucher.discountValue > 100) {
    ctx.addIssue({ code: "custom", path: ["voucher", "discountValue"], message: "Percent discount must be 100 or less." });
  }
});
