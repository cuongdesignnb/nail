"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Layers, Sparkles, Mail, ArrowRight, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { BlogPostDTO, BlogCategoryDTO } from "@/types/blog";
import { motion } from "framer-motion";

interface BlogArticleSidebarProps {
  post: BlogPostDTO;
  popularCategories: BlogCategoryDTO[];
  trendingPosts: BlogPostDTO[];
}

export function BlogArticleSidebar({ post, popularCategories, trendingPosts }: BlogArticleSidebarProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Extract headings for Table of Contents
  const extractHeadings = (htmlContent?: string | null) => {
    if (!htmlContent) return [];
    // Extract H2 headings
    const regex = /<h2[^>]*>([\s\S]*?)<\/h2>/g;
    const headings = [];
    let match;
    while ((match = regex.exec(htmlContent)) !== null) {
      // Clean tags inside heading if any
      const cleaned = match[1].replace(/<[^>]*>/g, "").trim();
      if (cleaned) {
        headings.push(cleaned);
      }
    }
    return headings;
  };

  const headings = extractHeadings(post.content);

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
    <aside className="space-y-8 text-left font-sans lg:col-span-4 self-start sticky top-[80px]">
      
      {/* 1. About the Author Widget */}
      <div className="bg-white border border-aera-champagne/45 rounded-3xl p-6 shadow-sm">
        <h4 className="font-heading text-xs uppercase tracking-widest text-aera-accent border-b border-aera-champagne/40 pb-3 mb-4 font-bold">
          About the Author
        </h4>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {post.authorAvatar ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-aera-champagne/50 shrink-0">
                <Image src={post.authorAvatar} alt={post.authorName || "Author"} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-aera-cream border border-aera-champagne/50 flex items-center justify-center shrink-0">
                <User size={20} className="text-aera-accent" />
              </div>
            )}
            <div>
              <h5 className="font-bold text-xs text-aera-ink">{post.authorName || "Aera Team"}</h5>
              <p className="text-[10px] text-aera-muted">{post.authorRole || "Nail Specialist"}</p>
            </div>
          </div>
          <p className="text-[11px] text-aera-muted leading-relaxed">
            Nail care experts at Aera Nail Lounge, passionate about elevating your beauty and self-care journey.
          </p>

          <div className="flex gap-2.5 pt-2 border-t border-aera-champagne/10">
            <span className="text-[9px] font-semibold text-aera-muted uppercase tracking-wider self-center">Follow Us</span>
            <div className="flex gap-2">
              <a href="https://facebook.com" className="text-gray-400 hover:text-aera-accent"><Facebook size={12} /></a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-aera-accent"><Instagram size={12} /></a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-aera-accent"><Twitter size={12} /></a>
              <a href="https://youtube.com" className="text-gray-400 hover:text-aera-accent"><Youtube size={12} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Table of Contents Widget */}
      {headings.length > 0 && (
        <div className="bg-white border border-aera-champagne/45 rounded-3xl p-6 shadow-sm">
          <h4 className="font-heading text-xs uppercase tracking-widest text-aera-accent border-b border-aera-champagne/40 pb-3 mb-4 font-bold">
            Table of Contents
          </h4>
          <ul className="space-y-2.5 pl-0 text-left list-none">
            {headings.map((heading, idx) => (
              <li key={idx} className="text-[11px] text-aera-muted hover:text-aera-accent transition-colors flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-aera-champagne border border-aera-accent/35 mt-1.5 shrink-0" />
                <a
                  href={`#heading-${idx}`}
                  onClick={(e) => {
                    e.preventDefault();
                    // Scroll to text matches or dynamic page element
                    const elements = Array.from(document.querySelectorAll("h2"));
                    const target = elements.find(el => el.textContent === heading);
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }}
                  className="hover:underline text-inherit decoration-none"
                >
                  {heading}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 3. Popular Categories Widget */}
      <div className="bg-white border border-aera-champagne/45 rounded-3xl p-6 shadow-sm">
        <h4 className="font-heading text-xs uppercase tracking-widest text-aera-accent border-b border-aera-champagne/40 pb-3 mb-4 font-bold">
          Popular Categories
        </h4>
        <div className="space-y-2.5">
          {popularCategories.slice(0, 6).map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              className="flex items-center justify-between text-xs text-aera-muted hover:text-aera-accent transition-colors decoration-none"
            >
              <span>{cat.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] bg-aera-cream text-aera-muted">
                {cat.postCount ?? 0}
              </span>
            </Link>
          ))}
          <Link
            href="/blog"
            className="w-full inline-block text-center text-[10px] font-bold text-aera-accent hover:underline uppercase tracking-wider pt-2 border-t border-aera-champagne/10 decoration-none"
          >
            View All Categories
          </Link>
        </div>
      </div>

      {/* 4. Related / Trending Posts Widget */}
      <div className="bg-white border border-aera-champagne/45 rounded-3xl p-6 shadow-sm">
        <h4 className="font-heading text-xs uppercase tracking-widest text-aera-accent border-b border-aera-champagne/40 pb-3 mb-4 font-bold">
          Related Posts
        </h4>
        <div className="space-y-4">
          {trendingPosts.slice(0, 3).map((item) => (
            <div key={item.id} className="group flex gap-3 items-center">
              {item.coverImage && (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-aera-cream shrink-0 border border-aera-champagne/20">
                  <Image src={item.coverImage} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="space-y-0.5 text-left min-w-0">
                <h5 className="font-heading text-[11px] text-aera-ink group-hover:text-aera-accent transition-colors font-normal line-clamp-2 leading-snug">
                  <Link href={`/blog/${item.slug}`} className="decoration-none text-inherit">
                    {item.title}
                  </Link>
                </h5>
                <span className="text-[9px] text-aera-muted block">{formatDate(item.publishedAt)}</span>
              </div>
            </div>
          ))}
          <Link
            href="/blog"
            className="w-full inline-block text-center text-[10px] font-bold text-aera-accent hover:underline uppercase tracking-wider pt-2 border-t border-aera-champagne/10 decoration-none"
          >
            View All Posts
          </Link>
        </div>
      </div>

      {/* 5. Newsletter block */}
      <div className="bg-aera-cream/40 border border-aera-champagne/50 rounded-[2rem] p-6 shadow-sm relative overflow-hidden">
        {/* Background graphic */}
        <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none select-none">
          <Mail size={120} className="text-aera-accent" />
        </div>

        <div className="space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1 text-[8px] font-bold tracking-widest text-aera-accent uppercase">
            <Sparkles size={9} className="fill-aera-accent text-aera-accent" />
            <span>Get Beauty Tips</span>
          </span>
          <h4 className="font-heading text-base font-normal text-aera-ink leading-tight">
            Straight to Your Inbox
          </h4>
          <p className="text-[11px] text-aera-muted leading-relaxed">
            Subscribe to our newsletter for exclusive tips, trends & salon updates.
          </p>

          {subscribed ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold rounded-xl p-3 text-center">
              Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-xl border border-aera-champagne/70 px-4 py-2 text-xs text-aera-ink placeholder-gray-400 focus:border-aera-accent outline-none bg-white shadow-sm"
              />
              <button
                type="submit"
                className="w-full bg-aera-accent hover:bg-aera-accentHover text-white text-xs font-bold py-2 rounded-xl shadow-sm transition-all duration-300 border-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Subscribe Now</span>
                <ArrowRight size={12} />
              </button>
            </form>
          )}
        </div>
      </div>

    </aside>
  );
}
export default BlogArticleSidebar;
