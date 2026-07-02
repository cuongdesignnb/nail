"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Sparkles } from "lucide-react";
import { BlogCategoryDTO, BlogPostDTO } from "@/types/blog";

interface BlogSidebarProps {
  popularCategories: BlogCategoryDTO[];
  trendingPosts: BlogPostDTO[];
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    buttonLabel: string;
  };
}

export function BlogSidebar({ popularCategories, trendingPosts, newsletter }: BlogSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleCategorySelect = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    params.delete("page");
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <aside className="space-y-8 text-left font-sans">
      
      {/* 1. Popular Categories list */}
      <div className="bg-white border border-aera-champagne/45 rounded-3xl p-6 shadow-sm">
        <h4 className="font-heading text-xs uppercase tracking-widest text-aera-accent border-b border-aera-champagne/40 pb-3 mb-4 font-bold">
          Popular Categories
        </h4>
        <div className="space-y-2">
          {popularCategories.map((c) => {
            const isActive = activeCategory === c.slug;
            return (
              <button
                key={c.id}
                onClick={() => handleCategorySelect(c.slug)}
                className={`w-full flex items-center justify-between py-2 text-xs transition-colors border-none bg-transparent cursor-pointer ${
                  isActive ? "text-aera-accent font-bold" : "text-aera-muted hover:text-aera-accent"
                }`}
              >
                <span>{c.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                  isActive ? "bg-aera-accent text-white" : "bg-aera-cream text-aera-muted"
                }`}>
                  {c.postCount ?? 0}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => handleCategorySelect("all")}
            className="w-full text-center text-[10px] font-bold text-aera-accent hover:underline uppercase tracking-wider pt-2 border-t border-aera-champagne/10 bg-transparent cursor-pointer"
          >
            View All Categories
          </button>
        </div>
      </div>

      {/* 2. Trending Articles widget */}
      <div className="bg-white border border-aera-champagne/45 rounded-3xl p-6 shadow-sm">
        <h4 className="font-heading text-xs uppercase tracking-widest text-aera-accent border-b border-aera-champagne/40 pb-3 mb-4 font-bold">
          Trending Articles
        </h4>
        <div className="space-y-4">
          {trendingPosts.map((post) => (
            <div key={post.id} className="group flex gap-3 items-center">
              {post.coverImage && (
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-aera-cream shrink-0 border border-aera-champagne/20">
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}
              <div className="space-y-1">
                <h5 className="font-heading text-xs text-aera-ink group-hover:text-aera-accent transition-colors font-normal line-clamp-2 leading-snug">
                  <Link href={`/blog/${post.slug}`} className="decoration-none text-inherit">
                    {post.title}
                  </Link>
                </h5>
                <span className="text-[9px] text-aera-muted block">{formatDate(post.publishedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Newsletter Subscribe banner card */}
      <div id="newsletter-section" className="bg-aera-cream/40 border border-aera-champagne/50 rounded-[2rem] p-6 shadow-sm relative overflow-hidden">
        {/* Background image mockup styling */}
        <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none">
          <Mail size={120} className="text-aera-accent" />
        </div>

        <div className="space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1 text-[8px] font-bold tracking-widest text-aera-accent uppercase">
            <Sparkles size={9} className="fill-aera-accent" />
            <span>Newsletter</span>
          </span>
          <h4 className="font-heading text-lg font-normal text-aera-ink leading-tight">
            {newsletter.title}
          </h4>
          <p className="text-xs text-aera-muted leading-relaxed">
            {newsletter.description}
          </p>

          {subscribed ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold rounded-xl p-3 text-center">
              Thank you for subscribing! Keep checking your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={newsletter.placeholder}
                className="w-full rounded-xl border border-aera-champagne/70 px-4 py-2.5 text-xs text-aera-ink placeholder-gray-400 focus:border-aera-accent outline-none bg-white shadow-sm"
              />
              <button
                type="submit"
                className="w-full bg-aera-accent hover:bg-aera-accentHover text-white text-xs font-bold py-2.5 rounded-xl shadow-sm transition-all duration-300 border-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{newsletter.buttonLabel}</span>
                <ArrowRight size={13} />
              </button>
            </form>
          )}
        </div>
      </div>

    </aside>
  );
}
export default BlogSidebar;
