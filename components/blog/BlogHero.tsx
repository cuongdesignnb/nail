"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { ImageConfig, ButtonConfig } from "@/types/blog";

interface BlogHeroProps {
  data: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    image: ImageConfig;
    primaryButton: ButtonConfig;
    secondaryButton: ButtonConfig;
  };
}

export function BlogHero({ data }: BlogHeroProps) {
  return (
    <section className="relative overflow-hidden bg-aera-cream/35 py-12 md:py-20 border-b border-aera-champagne/40">
      {/* Decorative Oval Sparkle */}
      <div className="absolute top-10 right-10 opacity-30 animate-pulse pointer-events-none">
        <Sparkles size={28} className="text-aera-accent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left Text Column */}
          <motion.div
            className="lg:col-span-7 space-y-6 text-left"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-aera-accent uppercase bg-white border border-aera-champagne px-3 py-1 rounded-full shadow-sm">
              <Sparkles size={10} className="fill-aera-accent" />
              <span>{data.eyebrow}</span>
            </span>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-aera-ink leading-tight font-normal">
              {data.title}{" "}
              <span className="block italic text-aera-accent font-serif pt-1">
                {data.highlight}
              </span>
            </h1>

            <p className="font-sans text-xs md:text-sm text-aera-muted leading-relaxed max-w-xl">
              {data.description}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={data.primaryButton.href}
                className="bg-aera-accent hover:bg-aera-accentHover text-white text-xs font-bold px-6 py-3 rounded-full shadow-sm transition-all duration-300 decoration-none"
              >
                {data.primaryButton.label}
              </a>
              <a
                href={data.secondaryButton.href}
                className="bg-white hover:bg-aera-cream text-aera-muted border border-aera-champagne px-6 py-3 rounded-full text-xs font-bold transition-all duration-300 decoration-none shadow-sm"
              >
                {data.secondaryButton.label}
              </a>
            </div>
          </motion.div>

          {/* Right Image Column */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative aspect-[4/3] md:aspect-[16/11] rounded-[2.5rem] overflow-hidden border border-aera-champagne shadow-luxury bg-white p-2">
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
                <Image
                  src={data.image.src || "/images/blog-hero.jpg"}
                  alt={data.image.alt || "Luxury Nail Editorial"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-700"
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
export default BlogHero;
