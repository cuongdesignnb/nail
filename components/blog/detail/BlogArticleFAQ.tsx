"use client";
import React, { useState } from "react";
import { ChevronDown, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BlogPostFAQ } from "@/types/blog";

interface BlogArticleFAQProps {
  faqs?: BlogPostFAQ[] | null;
}

export function BlogArticleFAQ({ faqs }: BlogArticleFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4 my-10 font-sans text-left">
      <h3 className="font-heading text-lg font-normal text-aera-ink tracking-wide border-b border-aera-champagne pb-3 flex items-center gap-2">
        <MessageSquare size={16} className="text-aera-accent" />
        <span>Frequently Asked Questions</span>
      </h3>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-aera-champagne/45 rounded-2xl overflow-hidden shadow-sm/5 transition-all"
            >
              <button
                onClick={() => toggleIndex(idx)}
                className="w-full flex justify-between items-center px-5 py-4 font-sans text-xs font-semibold text-aera-ink text-left hover:text-aera-accent transition-colors bg-transparent border-none cursor-pointer outline-none"
              >
                <span>{faq.question}</span>
                <span className={`w-5 h-5 rounded-full bg-aera-cream border border-aera-champagne/50 flex items-center justify-center transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-aera-accent" : "text-aera-muted"
                }`}>
                  <ChevronDown size={11} />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-5 pt-1 text-xs text-aera-muted leading-relaxed border-t border-aera-champagne/10 bg-aera-cream/10">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default BlogArticleFAQ;
