"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { BlogPostDTO } from "@/types/blog";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

interface FeaturedArticlesProps {
  featuredPost?: BlogPostDTO;
  sidePosts: BlogPostDTO[];
}

export function FeaturedArticles({ featuredPost, sidePosts }: FeaturedArticlesProps) {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Big Featured Article */}
        <div className="lg:col-span-8">
          {featuredPost ? (
            <motion.div
              className="group bg-white border border-aera-champagne/45 rounded-[2rem] overflow-hidden shadow-luxury hover:shadow-luxury/80 transition-all duration-300 flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/9] w-full bg-aera-cream overflow-hidden">
                <span className="absolute top-4 left-4 bg-aera-accent/90 backdrop-blur-sm text-white border border-aera-accent/20 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider z-10 shadow-sm">
                  FEATURED
                </span>
                <Image
                  src={normalizeMediaUrl(featuredPost.coverImage) || "/images/blog-featured.jpg"}
                  alt={featuredPost.coverImageAlt || featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Card content */}
              <div className="p-6 md:p-8 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold tracking-widest text-aera-accent uppercase">
                    {featuredPost.category?.name || "Nail Care"}
                  </span>
                  <h2 className="font-heading text-xl md:text-2xl lg:text-3xl text-aera-ink group-hover:text-aera-accent transition-colors leading-tight font-normal">
                    <Link href={`/blog/${featuredPost.slug}`} className="decoration-none text-inherit">
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="font-sans text-xs text-aera-muted leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </div>

                {/* Metadata & Button */}
                <div className="border-t border-aera-champagne/25 pt-4 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4 text-[10px] text-aera-muted">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} className="text-aera-accent" />
                      <span>{formatDate(featuredPost.publishedAt)}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} className="text-aera-accent" />
                      <span>{featuredPost.readTimeMinutes || 5} min read</span>
                    </span>
                    {featuredPost.authorName && (
                      <span className="hidden sm:inline">By {featuredPost.authorName}</span>
                    )}
                  </div>
                  
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 bg-aera-cream hover:bg-aera-champagne/40 text-aera-ink hover:text-aera-accent border border-aera-champagne px-4 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 decoration-none"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <p className="text-xs text-aera-muted italic">No featured article available.</p>
          )}
        </div>

        {/* Right Side: 2 Small Side Featured Articles */}
        <div className="lg:col-span-4 flex flex-col gap-6 justify-between">
          {sidePosts.map((post, idx) => (
            <motion.div
              key={post.id}
              className="group bg-white border border-aera-champagne/45 rounded-2xl p-4 shadow-sm hover:shadow-luxury transition-all duration-300 flex gap-4 h-full items-start"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              {/* Thumbnail */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-aera-cream shrink-0 border border-aera-champagne/20">
                <Image
                  src={normalizeMediaUrl(post.coverImage) || "/images/blog-side-1.jpg"}
                  alt={post.coverImageAlt || post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Details content */}
              <div className="flex-grow flex flex-col justify-between h-full space-y-2">
                <div className="space-y-1">
                  <span className="text-[8px] font-bold tracking-widest text-aera-accent uppercase block">
                    {post.category?.name || "Nail Beauty"}
                  </span>
                  <h3 className="font-heading text-xs sm:text-sm text-aera-ink group-hover:text-aera-accent transition-colors leading-snug font-normal line-clamp-3">
                    <Link href={`/blog/${post.slug}`} className="decoration-none text-inherit">
                      {post.title}
                    </Link>
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-aera-muted border-t border-aera-champagne/10 pt-2 mt-auto">
                  <span>{formatDate(post.publishedAt)}</span>
                  <span>•</span>
                  <span>{post.readTimeMinutes || 4} min read</span>
                </div>
              </div>
            </motion.div>
          ))}
          {sidePosts.length === 0 && (
            <p className="text-xs text-aera-muted italic">No trending topics.</p>
          )}
        </div>

      </div>
    </section>
  );
}
export default FeaturedArticles;
