"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryTrendDTO } from "@/types/gallery";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

export function TrendingInspirations({ items }: { items: GalleryTrendDTO[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-aera-bg py-16 md:py-20 relative">
      <Container>
        {/* Header with Navigation Arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <SectionHeading
            eyebrow="TREND ALERT"
            title="Trending Inspirations"
            align="left"
            className="!mb-0"
          />

          <div className="flex gap-2 shrink-0">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full border border-aera-champagne/70 bg-white hover:bg-aera-accent hover:text-white text-aera-accent flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm"
              aria-label="Scroll left"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full border border-aera-champagne/70 bg-white hover:bg-aera-accent hover:text-white text-aera-accent flex items-center justify-center transition-all duration-300 cursor-pointer shadow-sm"
              aria-label="Scroll right"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Area */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth scrollbar-hide px-1"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {items.map((trend, index) => (
            <motion.div
              key={trend.id || index}
              whileHover={{ y: -4 }}
              className="flex-none w-[200px] md:w-[220px] bg-aera-bg rounded-2xl overflow-hidden border border-aera-champagne/45 p-4 shadow-sm hover:shadow-luxury hover:border-aera-accent/30 transition-all duration-300 flex flex-col items-center justify-start text-center cursor-pointer"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Thumbnail Image */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-aera-champagne/10 mb-4">
                <Image
                  src={normalizeMediaUrl(trend.image) || "/images/about-nail-detail.jpg"}
                  alt={trend.imageAlt || trend.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Title */}
              <h3 className="font-heading text-sm font-semibold text-aera-ink group-hover:text-aera-accent transition-colors">
                {trend.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
export default TrendingInspirations;
