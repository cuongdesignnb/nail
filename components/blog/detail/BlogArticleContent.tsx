"use client";
import React from "react";
import { BlogQuickTakeaways } from "./BlogQuickTakeaways";
import { BlogArticleFAQ } from "./BlogArticleFAQ";
import { BlogPostDTO } from "@/types/blog";
import { Quote, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface BlogArticleContentProps {
  post: BlogPostDTO;
}

export function BlogArticleContent({ post }: BlogArticleContentProps) {
  // Extract custom takeaways if they are passed, otherwise defaults are shown
  const takeawaysList = post.faqs ? (post.faqs.slice(0, 5).map(f => f.question)) : undefined;

  return (
    <div className="space-y-6 text-left font-sans lg:col-span-8">
      {/* 1. Opening Paragraph */}
      <div className="text-xs md:text-sm text-aera-muted leading-relaxed first-letter:text-3xl first-letter:font-heading first-letter:text-aera-accent first-letter:mr-2 first-letter:float-left">
        A flawless gel manicure is an investment—and a little extra care goes a long way. Whether you are a beauty minimalist or a nail art lover, these simple yet effective habits will help you extend wear time, prevent chipping, and maintain that fresh, salon-perfect look for weeks.
      </div>

      {/* 2. Editorial Quote Callout Box */}
      <motion.div
        className="relative bg-aera-cream/40 border-l-2 border-aera-accent/70 p-6 rounded-r-3xl my-6"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
      >
        <Quote size={32} className="text-aera-champagne absolute top-3 left-4 opacity-40 shrink-0" />
        <div className="relative z-10 pl-6 space-y-1">
          <p className="font-heading italic text-xs sm:text-sm text-aera-accent leading-relaxed">
            &ldquo;Beautiful nails aren&apos;t just about the polish—it&apos;s about the care, the routine, and the details.&rdquo;
          </p>
        </div>
        <div className="absolute right-4 bottom-2 opacity-35">
          <Sparkles size={12} className="text-aera-accent" />
        </div>
      </motion.div>

      {/* 3. Quick Takeaways checklist */}
      <BlogQuickTakeaways />

      {/* 4. Rich content editor rendering */}
      <div
        className="prose prose-sm max-w-none text-aera-ink leading-relaxed font-sans space-y-6
          prose-headings:font-heading prose-headings:font-normal prose-headings:text-aera-ink
          prose-h2:text-base prose-h2:md:text-lg prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-aera-champagne/40 prose-h2:pb-2
          prose-h3:text-xs prose-h3:md:text-sm prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-aera-accent
          prose-p:text-xs prose-p:md:text-sm prose-p:text-aera-muted prose-p:leading-relaxed
          prose-a:text-aera-accent prose-a:underline hover:prose-a:text-aera-accentHover
          prose-img:rounded-3xl prose-img:border prose-img:border-aera-champagne/45 prose-img:p-1.5 prose-img:bg-white
          prose-ol:list-decimal prose-ol:pl-4 prose-ol:text-xs prose-ol:space-y-2 prose-ol:text-aera-muted
          prose-ul:list-disc prose-ul:pl-4 prose-ul:text-xs prose-ul:space-y-2 prose-ul:text-aera-muted"
        dangerouslySetInnerHTML={{ __html: post.content || "" }}
      />

      {/* 5. Accordion FAQs */}
      <BlogArticleFAQ faqs={post.faqs} />
    </div>
  );
}
export default BlogArticleContent;
