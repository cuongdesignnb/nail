import { z } from "zod";

const requiredText = (max = 160) =>
  z.string().trim().min(1, "Required").max(max).refine((value) => !/<[^>]*>/.test(value), "HTML is not allowed");

const optionalText = (max = 160) =>
  z.string().trim().max(max).optional();

const hrefSchema = z.string().trim().refine((value) => {
  return value.startsWith("/") || value.startsWith("https://") || value.startsWith("mailto:") || value.startsWith("tel:") || value.startsWith("#");
}, "Use a safe link: /, https://, mailto:, tel:, or #section");

const imageSrcSchema = z.string().trim().refine((value) => {
  return value.startsWith("/") || value.startsWith("https://images.unsplash.com/") || value.startsWith(process.env.NEXT_PUBLIC_CDN_HOST ?? "https://cdn.invalid/");
}, "Use a public path, Unsplash URL, or configured CDN URL");

const colorSchema = z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional();

const imageSchema = z.object({
  src: imageSrcSchema,
  alt: requiredText(160)
});

const buttonSchema = z.object({
  label: requiredText(80),
  href: hrefSchema,
  variant: z.enum(["primary", "secondary", "ghost"]).optional(),
  icon: optionalText(40)
});

const linkSchema = z.object({
  label: requiredText(80),
  href: hrefSchema
});

const iconCardSchema = z.object({
  id: requiredText(80),
  icon: requiredText(60),
  title: requiredText(160),
  description: requiredText(500)
});

const uniqueIds = <T extends { id: string }>(items: T[]) => new Set(items.map((item) => item.id)).size === items.length;

export const aboutContentSchema = z.object({
  seo: z.object({
    title: requiredText(160),
    description: requiredText(500)
  }),
  header: z.object({
    logo: imageSchema,
    brandName: z.literal("Aera Nail Lounge"),
    navItems: z.array(linkSchema).min(1).max(10),
    cta: buttonSchema
  }),
  hero: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    highlightText: requiredText(160),
    description: requiredText(500),
    primaryButton: buttonSchema,
    secondaryButton: buttonSchema,
    image: imageSchema,
    watermark: optionalText(40)
  }),
  story: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    paragraphs: z.array(requiredText(1200)).min(1).max(6),
    images: z.array(imageSchema).min(1).max(4),
    statCard: z.object({
      value: requiredText(40),
      label: requiredText(80),
      icon: requiredText(60)
    }),
    highlights: z.array(iconCardSchema).min(1).max(8).refine(uniqueIds, "IDs must be unique")
  }),
  missionVisionValues: z.array(iconCardSchema).min(1).max(8).refine(uniqueIds, "IDs must be unique"),
  benefits: z.object({
    eyebrow: requiredText(120),
    items: z.array(iconCardSchema).min(1).max(8).refine(uniqueIds, "IDs must be unique")
  }),
  experts: z.object({
    eyebrow: requiredText(120),
    title: requiredText(160),
    members: z.array(z.object({
      id: requiredText(80),
      name: requiredText(120),
      role: requiredText(120),
      avatar: imageSchema,
      socials: z.object({
        instagram: hrefSchema.optional(),
        facebook: hrefSchema.optional(),
        tiktok: hrefSchema.optional()
      }).optional()
    })).min(1).max(12).refine(uniqueIds, "IDs must be unique")
  }),
  salonExperience: z.object({
    eyebrow: requiredText(120),
    images: z.array(z.object({
      id: requiredText(80),
      image: imageSchema,
      title: optionalText(120)
    })).min(1).max(12).refine(uniqueIds, "IDs must be unique")
  }),
  process: z.object({
    eyebrow: requiredText(120),
    steps: z.array(z.object({
      id: requiredText(80),
      step: requiredText(20),
      icon: requiredText(60),
      title: requiredText(160),
      description: requiredText(500)
    })).min(1).max(8).refine(uniqueIds, "IDs must be unique")
  }),
  testimonials: z.object({
    eyebrow: requiredText(120),
    items: z.array(z.object({
      id: requiredText(80),
      name: requiredText(120),
      role: optionalText(120),
      avatar: imageSchema.optional(),
      rating: z.number().min(1).max(5),
      quote: requiredText(1200)
    })).min(1).max(10).refine(uniqueIds, "IDs must be unique")
  }),
  cta: z.object({
    title: requiredText(160),
    description: requiredText(500),
    button: buttonSchema,
    contactSnippets: z.array(z.object({
      icon: requiredText(60),
      label: requiredText(80),
      value: requiredText(160),
      href: hrefSchema.optional()
    })).max(5)
  }),
  footer: z.object({
    brandText: requiredText(500),
    quickLinks: z.array(linkSchema).max(10),
    services: z.array(linkSchema).max(10),
    contact: z.array(z.object({
      icon: requiredText(60),
      label: requiredText(80),
      value: requiredText(160),
      href: hrefSchema.optional()
    })).max(5),
    newsletter: z.object({
      title: requiredText(120),
      description: requiredText(300),
      placeholder: requiredText(120)
    }),
    copyright: requiredText(160)
  }),
  theme: z.object({
    primaryColor: colorSchema,
    secondaryColor: colorSchema,
    backgroundColor: colorSchema,
    textColor: colorSchema
  }).optional()
});

export type AboutContentInput = z.infer<typeof aboutContentSchema>;
