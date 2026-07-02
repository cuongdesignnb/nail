"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ServiceGalleryItemDTO } from "@/types/services";

export function DesignInspiration({ items }: { items: ServiceGalleryItemDTO[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Minimal", "Elegant", "Glitter", "Bridal", "Art"];

  const filteredItems =
    activeFilter === "All"
      ? items
      : items.filter((item) => item.tag?.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section className="bg-aera-bg py-20 relative">
      <Container>
        <SectionHeading
          eyebrow="INSPIRATION LAB"
          title="Design Inspiration Gallery"
          align="center"
        />

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full font-sans text-xs tracking-wider transition-all duration-300 ${
                activeFilter === filter
                  ? "bg-aera-accent text-aera-bg shadow-sm font-bold"
                  : "bg-aera-champagne/20 text-aera-muted border border-aera-champagne/40 hover:border-aera-accent/30"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Gallery Grid with AnimatePresence */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id || index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="group relative aspect-square rounded-[2rem] overflow-hidden shadow-sm border border-aera-champagne/40 bg-aera-champagne/10 hover:shadow-luxury transition-all duration-500"
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt || item.title || "Nail Inspiration"}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Overlap Details on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-aera-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                  {item.title && (
                    <h4 className="font-heading text-base font-normal text-aera-bg leading-snug mb-1">
                      {item.title}
                    </h4>
                  )}
                  {item.tag && (
                    <span className="font-sans text-[10px] text-aera-gold uppercase tracking-widest font-bold">
                      {item.tag}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  );
}
export default DesignInspiration;
