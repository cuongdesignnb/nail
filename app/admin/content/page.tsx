"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Globe,
  Home,
  Image as ImageIcon,
  Info,
  Layers,
  Package,
  Palette,
  Phone,
  Sparkles,
  Tags,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

/* ────────────────────────────── Page Config ────────────────────────────── */
type ContentPage = {
  label: string;
  description: string;
  icon: React.ElementType;
  href: string;
  status: "configured" | "partial" | "not-configured";
  lastUpdated?: string;
};

const contentPages: ContentPage[] = [
  {
    label: "About Page",
    description: "Our story, team, values, process, testimonials",
    icon: Info,
    href: "/admin/content-settings/about",
    status: "configured",
  },
  {
    label: "Services Page",
    description: "Service categories, items, addons, gallery, FAQ",
    icon: Sparkles,
    href: "/admin/services",
    status: "configured",
  },
  {
    label: "Gallery Page",
    description: "Collections, categories, trends, process steps",
    icon: Palette,
    href: "/admin/gallery",
    status: "configured",
  },
  {
    label: "Packages Page",
    description: "Package categories, pricing, comparison, benefits",
    icon: Package,
    href: "/admin/packages",
    status: "configured",
  },
  {
    label: "Blog / Beauty Journal",
    description: "Blog posts, categories, settings, featured content",
    icon: FileText,
    href: "/admin/blog",
    status: "configured",
  },
  {
    label: "Homepage",
    description: "Hero section, featured services, testimonials",
    icon: Home,
    href: "#",
    status: "not-configured",
  },
  {
    label: "Promotions Page",
    description: "Active promotions, seasonal offers, discounts",
    icon: Tags,
    href: "/admin/promotions",
    status: "partial",
  },
  {
    label: "Contact Page",
    description: "Contact form, map, business hours, social links",
    icon: Phone,
    href: "#",
    status: "not-configured",
  },
];

const quickLinks = [
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "SEO Manager", href: "/admin/seo", icon: Globe },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
];

function StatusIndicator({ status }: { status: ContentPage["status"] }) {
  if (status === "configured") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
        <CheckCircle2 size={12} /> Configured
      </span>
    );
  }
  if (status === "partial") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
        <AlertCircle size={12} /> Partial
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
      <AlertCircle size={12} /> Not Configured
    </span>
  );
}

/* ────────────────────────────── Content Hub Page ────────────────────────────── */
export default function ContentHubPage() {
  return (
    <div className="max-w-[1400px]">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-aera-muted mb-2">
          Website Management
        </p>
        <h1 className="font-heading text-[clamp(28px,3.5vw,42px)] font-medium text-aera-ink mb-2">
          Content Hub
        </h1>
        <p className="text-aera-muted text-sm max-w-xl">
          Manage all your website pages, media, and SEO from one place. Each card links to the
          dedicated editor for that section.
        </p>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3 mb-8">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center gap-2 bg-white/80 border border-aera-champagne/40 rounded-xl px-4 py-2.5 text-xs font-bold text-aera-ink hover:border-aera-accent/40 hover:shadow-sm transition-all no-underline"
          >
            <link.icon size={15} className="text-aera-accent" />
            {link.label}
          </Link>
        ))}
      </div>

      {/* Page Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {contentPages.map((page, index) => (
          <motion.div
            key={page.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35 }}
          >
            <Link
              href={page.href}
              className={`group block bg-white/90 border border-aera-champagne/30 rounded-2xl p-5 hover:shadow-luxury hover:border-aera-accent/20 transition-all duration-300 no-underline ${
                page.status === "not-configured" ? "opacity-60 pointer-events-none" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aera-champagne to-aera-cream flex items-center justify-center group-hover:from-aera-accent/10 group-hover:to-aera-champagne transition-all">
                  <page.icon size={18} className="text-aera-accent" />
                </div>
                <StatusIndicator status={page.status} />
              </div>
              <h3 className="text-sm font-bold text-aera-ink mb-1.5 group-hover:text-aera-accent transition-colors">
                {page.label}
              </h3>
              <p className="text-[11px] text-aera-muted leading-relaxed mb-3">
                {page.description}
              </p>
              {page.status !== "not-configured" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-aera-accent group-hover:gap-2 transition-all">
                  Edit Content <ArrowRight size={12} />
                </span>
              )}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
