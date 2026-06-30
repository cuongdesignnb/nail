"use client";
import React from "react";
import { AboutPageContent } from "@/types/about";
import { Container } from "@/components/common/Container";
import { AnimatedButton } from "@/components/common/AnimatedButton";
import { getIcon } from "@/lib/icons";
import { motion } from "framer-motion";
import { fadeUp } from "@/components/common/FloatingOrnaments";

interface AboutCTAProps {
  data: AboutPageContent["cta"];
}

export function AboutCTA({ data }: AboutCTAProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-aera-champagne/40 to-aera-champagne/15 border-t border-b border-aera-accent/10 py-16 md:py-20 text-left">
      {/* Background Floral Overlay / Watermarks */}
      <div className="absolute right-0 bottom-0 w-[300px] h-[300px] opacity-10 pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-aera-accent">
          {/* Faint luxury flower vector sketch */}
          <path d="M50 10 C55 25, 45 25, 50 40 C55 25, 65 25, 50 10 Z" />
          <path d="M50 90 C55 75, 45 75, 50 60 C55 75, 65 75, 50 90 Z" />
          <path d="M10 50 C25 55, 25 45, 40 50 C25 55, 25 65, 10 50 Z" />
          <path d="M90 50 C75 55, 75 45, 60 50 C75 55, 75 65, 90 50 Z" />
          <circle cx="50" cy="50" r="5" />
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          
          {/* Left Column: Copy & Contact Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="max-w-3xl flex-1"
          >
            <h2 className="font-heading font-normal text-3xl md:text-4xl text-aera-ink leading-tight mb-4">
              {data.title}
            </h2>
            <p className="font-sans text-sm md:text-base text-aera-muted leading-relaxed mb-8 max-w-2xl">
              {data.description}
            </p>

            {/* Contact Snippets Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-aera-accent/10">
              {data.contactSnippets.map((snippet, idx) => {
                const SnippetIcon = getIcon(snippet.icon);
                return (
                  <div key={idx} className="flex gap-3 text-left">
                    <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-aera-accent shrink-0 border border-aera-accent/5">
                      <SnippetIcon size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-[11px] font-bold text-aera-accent uppercase tracking-wider">
                        {snippet.label}
                      </span>
                      {snippet.href ? (
                        <a
                          href={snippet.href}
                          className="font-sans text-xs md:text-sm text-aera-ink font-semibold mt-0.5 hover:text-aera-accent transition-colors duration-300"
                        >
                          {snippet.value}
                        </a>
                      ) : (
                        <span className="font-sans text-xs md:text-sm text-aera-ink font-semibold mt-0.5">
                          {snippet.value}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="shrink-0 flex items-center"
          >
            <AnimatedButton
              label={data.button.label}
              href={data.button.href}
              variant={data.button.variant || "primary"}
              icon={data.button.icon}
              className="px-8 py-4 !min-h-[52px]"
            />
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
export default AboutCTA;
