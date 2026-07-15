"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Facebook, Instagram, Mail, Sparkles } from "lucide-react";
import { BlogPostDTO } from "@/types/blog";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

// Custom Pinterest icon since it's not standard in Lucide React
function PinterestIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.42 7.62 11.16-.1-.95-.19-2.4.04-3.43.21-.92 1.35-5.74 1.35-5.74s-.34-.69-.34-1.72c0-1.61.93-2.81 2.09-2.81 1 0 1.47.74 1.47 1.63 0 1-.64 2.5-1 3.88-.27 1.17.58 2.13 1.73 2.13 2.08 0 3.68-2.19 3.68-5.35 0-2.8-2-4.75-4.88-4.75-3.32 0-5.27 2.49-5.27 5.06 0 1 .39 2.08.88 2.68.1.11.11.21.08.32-.1.38-.3.1.84.4-.1.4-.12.44-.24.4-.64-.3-1.48-.68-1.92-1.57-.65-1.32-1-2.73-1-4.2C2.7 7.63 6.95 3.3 12.63 3.3c4.54 0 8.08 3.23 8.08 7.56 0 4.52-2.85 8.16-6.8 8.16-1.33 0-2.58-.69-3.01-1.51 0 0-.66 2.51-.82 3.13-.3 1.15-1.1 2.58-1.64 3.46 1.12.35 2.3.54 3.52.54 6.63 0 12-5.37 12-12S18.63 0 12 0z" />
    </svg>
  );
}

interface BlogArticleHeroProps {
  post: BlogPostDTO;
}

export function BlogArticleHero({ post }: BlogArticleHeroProps) {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post.title;

  return (
    <section className="relative overflow-hidden bg-aera-cream/35 py-12 md:py-20 border-b border-aera-champagne/40 text-left">
      {/* Decorative Ornaments */}
      <div className="absolute top-10 left-10 opacity-30 animate-pulse pointer-events-none">
        <Sparkles size={28} className="text-aera-accent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs */}
        <div className="mb-6 font-sans text-[10px] uppercase tracking-widest text-aera-muted flex items-center gap-1.5">
          <Link href="/" className="hover:text-aera-accent transition-colors decoration-none">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-aera-accent transition-colors decoration-none">Blog</Link>
          {post.category && (
            <>
              <span>/</span>
              <Link href={`/blog/category/${post.category.slug}`} className="hover:text-aera-accent transition-colors decoration-none font-semibold text-aera-accent">
                {post.category.name}
              </Link>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left: Metadata and Titles */}
          <motion.div
            className="lg:col-span-7 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {post.category && (
              <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-widest text-aera-accent uppercase bg-white border border-aera-champagne px-3 py-1 rounded-full shadow-sm">
                <Sparkles size={9} className="fill-aera-accent text-aera-accent" />
                <span>{post.category.name}</span>
              </span>
            )}

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-aera-ink leading-tight font-normal">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="font-sans text-xs md:text-sm text-aera-muted leading-relaxed max-w-xl">
                {post.excerpt}
              </p>
            )}

            {/* Meta details row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] text-aera-muted pt-2 border-t border-aera-champagne/30">
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-aera-accent" />
                <span>{formatDate(post.publishedAt)}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-aera-accent" />
                <span>{post.readTimeMinutes || 5} min read</span>
              </span>
              {post.authorName && (
                <span className="flex items-center gap-1">
                  <User size={12} className="text-aera-accent" />
                  <span>By {post.authorName}</span>
                </span>
              )}
            </div>

            {/* Share widgets */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-[9px] font-bold uppercase tracking-wider text-aera-muted">Share:</span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white border border-aera-champagne text-aera-muted hover:text-aera-accent hover:border-aera-accent transition-colors flex items-center justify-center shadow-sm"
              >
                <Facebook size={12} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white border border-aera-champagne text-aera-muted hover:text-aera-accent hover:border-aera-accent transition-colors flex items-center justify-center shadow-sm"
              >
                <Instagram size={12} />
              </a>
              <a
                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareTitle || "")}`}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white border border-aera-champagne text-aera-muted hover:text-aera-accent hover:border-aera-accent transition-colors flex items-center justify-center shadow-sm"
              >
                <PinterestIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(shareTitle || "")}&body=${encodeURIComponent(shareUrl)}`}
                className="w-7 h-7 rounded-full bg-white border border-aera-champagne text-aera-muted hover:text-aera-accent hover:border-aera-accent transition-colors flex items-center justify-center shadow-sm"
              >
                <Mail size={12} />
              </a>
            </div>
          </motion.div>

          {/* Right: Cover Image */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-aera-champagne shadow-luxury bg-white p-2">
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
                <Image
                  src={normalizeMediaUrl(post.coverImage) || "/images/blog-hero.jpg"}
                  alt={post.coverImageAlt || post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover hover:scale-103 transition-transform duration-700"
                  priority
                />
              </div>
            </div>

            {/* Custom Ornament watermark */}
            <div className="absolute -bottom-6 -left-6 w-20 h-20 border border-aera-champagne/45 rounded-full pointer-events-none flex items-center justify-center font-heading text-xs text-aera-accent/35 italic select-none">
              an
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
export default BlogArticleHero;
