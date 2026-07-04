"use client";

import Link from "next/link";
import { Image as ImageIcon, Globe, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export function ContentHubHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-8"
    >
      {/* Subtitle + Title */}
      <p className="text-[11px] font-bold uppercase tracking-[1.5px] text-aera-muted mb-2">
        Website Management
      </p>
      <h1 className="font-heading text-[clamp(28px,3.5vw,42px)] font-medium text-aera-ink mb-2">
        Content Hub
      </h1>
      <p className="text-aera-muted text-sm max-w-xl leading-relaxed mb-6">
        Manage all your website pages, media, and SEO from one place. Each card
        shows live status, missing content, and quick actions for every section
        of the Aera Nail Lounge website.
      </p>

      {/* Quick action buttons */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/media"
          className="inline-flex items-center gap-2 bg-white/80 border border-aera-champagne/40 rounded-xl px-4 py-2.5 text-xs font-bold text-aera-ink hover:border-aera-accent/40 hover:shadow-sm transition-all no-underline"
        >
          <ImageIcon size={15} className="text-aera-accent" />
          Media Library
        </Link>

        <Link
          href="/admin/seo"
          className="inline-flex items-center gap-2 bg-white/80 border border-aera-champagne/40 rounded-xl px-4 py-2.5 text-xs font-bold text-aera-ink hover:border-aera-accent/40 hover:shadow-sm transition-all no-underline"
        >
          <Globe size={15} className="text-aera-accent" />
          SEO Manager
        </Link>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-aera-accent to-aera-bronze text-white rounded-xl px-4 py-2.5 text-xs font-bold hover:shadow-md transition-all no-underline"
        >
          <ExternalLink size={15} />
          View Website
        </Link>
      </div>
    </motion.div>
  );
}
