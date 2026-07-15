"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowLeft, ArrowRight, User, Sparkles } from "lucide-react";
import { BlogPostDTO } from "@/types/blog";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

interface BlogDetailProps {
  post: BlogPostDTO;
  related: BlogPostDTO[];
}

export function BlogDetail({ post, related }: BlogDetailProps) {
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <article className="bg-white min-h-screen text-left font-sans">
      
      {/* 1. Header Metadata Section */}
      <header className="bg-aera-cream/25 border-b border-aera-champagne/40 py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-10 right-10 opacity-20 pointer-events-none">
          <Sparkles size={20} className="text-aera-accent" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-aera-accent hover:underline uppercase tracking-wider mb-6 decoration-none"
          >
            <ArrowLeft size={12} />
            <span>Back to Journal</span>
          </Link>

          <div className="space-y-4">
            <span className="inline-block bg-aera-accent/15 text-aera-accent border border-aera-accent/20 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
              {post.category?.name || "Nail Care"}
            </span>

            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-aera-ink leading-tight font-normal">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xs md:text-sm text-aera-muted leading-relaxed max-w-3xl italic">
                {post.excerpt}
              </p>
            )}

            {/* Author card & times */}
            <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-aera-muted border-t border-aera-champagne/20 mt-6">
              <div className="flex items-center gap-2.5">
                {post.authorAvatar ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-aera-champagne/50">
                    <Image src={post.authorAvatar} alt={post.authorName || "Author"} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-aera-cream border border-aera-champagne/50 flex items-center justify-center">
                    <User size={12} className="text-aera-accent" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-aera-ink text-[11px]">{post.authorName || "Aera Team"}</h4>
                  {post.authorRole && <p className="text-[9px] text-aera-muted mt-0.5">{post.authorRole}</p>}
                </div>
              </div>

              <div className="flex items-center gap-4 text-[10px]">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-aera-accent" />
                  <span>{formatDate(post.publishedAt)}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-aera-accent" />
                  <span>{post.readTimeMinutes || 5} min read</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Cover Image Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 md:-mt-12 relative z-10">
        <div className="relative aspect-[16/9] w-full rounded-[2.5rem] overflow-hidden border border-aera-champagne shadow-luxury bg-white p-2">
          <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
            <Image
              src={normalizeMediaUrl(post.coverImage) || "/images/blog-hero.jpg"}
              alt={post.coverImageAlt || post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* 3. Rich text contents */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div
          className="prose prose-sm md:prose-base max-w-none text-aera-ink leading-relaxed font-sans space-y-6 
            prose-headings:font-heading prose-headings:font-normal prose-headings:text-aera-ink 
            prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 
            prose-p:text-xs prose-p:md:text-sm prose-p:text-aera-muted prose-p:leading-relaxed 
            prose-a:text-aera-accent prose-a:underline hover:prose-a:text-aera-accentHover"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />
      </div>

      {/* 4. Related Articles segment */}
      {related.length > 0 && (
        <section className="bg-aera-cream/20 py-16 border-t border-aera-champagne/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center mb-8 pb-3 border-b border-aera-champagne/30">
              <h3 className="font-heading text-lg font-normal text-aera-ink">
                Related Articles
              </h3>
              <Link
                href="/blog"
                className="text-[10px] font-bold text-aera-accent hover:underline uppercase tracking-wider decoration-none"
              >
                Explore More
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white border border-aera-champagne/45 rounded-3xl overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] bg-aera-cream overflow-hidden">
                    <Image src={normalizeMediaUrl(item.coverImage) || "/images/blog-1.jpg"} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                    <h4 className="font-heading text-xs text-aera-ink group-hover:text-aera-accent transition-colors font-semibold line-clamp-2 leading-snug">
                      <Link href={`/blog/${item.slug}`} className="decoration-none text-inherit">
                        {item.title}
                      </Link>
                    </h4>
                    <div className="flex justify-between items-center pt-2 border-t border-aera-champagne/10 text-[9px] text-aera-muted mt-auto">
                      <span>{formatDate(item.publishedAt)}</span>
                      <span className="flex items-center gap-0.5 text-aera-accent font-bold">
                        <span>Read</span>
                        <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </article>
  );
}
export default BlogDetail;
