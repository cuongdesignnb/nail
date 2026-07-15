"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";
import { BlogPostDTO } from "@/types/blog";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

interface LatestArticlesProps {
  posts: BlogPostDTO[];
}

export function LatestArticles({ posts }: LatestArticlesProps) {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6 text-left">
      <h3 className="font-heading text-lg font-normal text-aera-ink border-b border-aera-champagne pb-3 tracking-wide">
        Latest Articles
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="group bg-white border border-aera-champagne/45 rounded-3xl overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
          >
            {/* Cover Image aspect */}
            <div className="relative aspect-[16/10] bg-aera-cream overflow-hidden">
              <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-aera-accent border border-aera-champagne/50 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider z-10 shadow-sm">
                {post.category?.name || "Beauty"}
              </span>
              <Image
                src={normalizeMediaUrl(post.coverImage) || "/images/blog-1.jpg"}
                alt={post.coverImageAlt || post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Content Details */}
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

                <h4 className="font-heading text-base text-aera-ink group-hover:text-aera-accent transition-colors leading-snug font-normal line-clamp-2">
                  <Link href={`/blog/${post.slug}`} className="decoration-none text-inherit">
                    {post.title}
                  </Link>
                </h4>

                <p className="font-sans text-[11px] text-aera-muted leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Author & Arrow detail */}
              <div className="border-t border-aera-champagne/15 pt-3 mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {post.authorAvatar ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-aera-champagne/50">
                      <Image src={post.authorAvatar} alt={post.authorName || "Author"} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-aera-cream border border-aera-champagne/50 flex items-center justify-center">
                      <User size={10} className="text-aera-accent" />
                    </div>
                  )}
                  <span className="text-[10px] font-semibold text-aera-ink">
                    By {post.authorName || "Sophia C."}
                  </span>
                </div>

                <Link
                  href={`/blog/${post.slug}`}
                  className="w-7 h-7 rounded-full bg-aera-cream group-hover:bg-aera-accent text-aera-ink group-hover:text-white border border-aera-champagne/55 flex items-center justify-center transition-all duration-300"
                  aria-label={`Read ${post.title}`}
                >
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

          </article>
        ))}
        {posts.length === 0 && (
          <p className="text-xs text-aera-muted italic py-10 col-span-2 text-center">No articles found in this category.</p>
        )}
      </div>
    </div>
  );
}
export default LatestArticles;
