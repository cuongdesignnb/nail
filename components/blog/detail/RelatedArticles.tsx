"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { BlogPostDTO } from "@/types/blog";
import { motion } from "framer-motion";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

interface RelatedArticlesProps {
  posts: BlogPostDTO[];
}

export function RelatedArticles({ posts }: RelatedArticlesProps) {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!posts || posts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left font-sans border-t border-aera-champagne/20">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
        <span className="text-[10px] font-bold tracking-widest text-aera-accent uppercase">
          Curated Suggestions
        </span>
        <h3 className="font-heading text-2xl md:text-3xl text-aera-ink font-normal">
          You May Also Love
        </h3>
        <div className="w-12 h-0.5 bg-aera-accent/30 mx-auto mt-2" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((post, idx) => (
          <motion.div
            key={post.id}
            className="group bg-white border border-aera-champagne/45 rounded-3xl overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
          >
            {/* Aspect Cover Image */}
            <div className="relative aspect-[16/10] bg-aera-cream overflow-hidden">
              {post.category && (
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-aera-accent border border-aera-champagne/40 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider z-10 shadow-sm">
                  {post.category.name}
                </span>
              )}
              <Image
                src={normalizeMediaUrl(post.coverImage) || "/images/blog-1.jpg"}
                alt={post.coverImageAlt || post.title}
                fill
                sizes="(max-width: 768px) 100vw, 30vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Info details */}
            <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex gap-3 text-[9px] text-aera-muted">
                  <span className="flex items-center gap-1">
                    <Calendar size={10} className="text-aera-accent" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} className="text-aera-accent" />
                    <span>{post.readTimeMinutes || 4} min read</span>
                  </span>
                </div>

                <h4 className="font-heading text-sm text-aera-ink group-hover:text-aera-accent transition-colors leading-snug font-normal line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="decoration-none text-inherit">
                    {post.title}
                  </Link>
                </h4>
              </div>

              {/* Action arrow button */}
              <div className="border-t border-aera-champagne/15 pt-3 mt-auto flex items-center justify-between">
                <span className="text-[9px] text-aera-muted">By {post.authorName || "Aera Team"}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="w-7 h-7 rounded-full bg-aera-cream group-hover:bg-aera-accent text-aera-ink group-hover:text-white border border-aera-champagne/50 flex items-center justify-center transition-all duration-300"
                >
                  <ArrowRight size={11} />
                </Link>
              </div>
            </div>

          </motion.div>
        ))}
      </div>

    </section>
  );
}
export default RelatedArticles;
