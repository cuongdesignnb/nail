"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { GalleryCollectionDTO } from "@/types/gallery";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

export function FeaturedCollections({ items }: { items: GalleryCollectionDTO[] }) {
  return (
    <section id="collections" className="bg-aera-bg py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="CURATED WORK"
          title="Featured Nail Collections"
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {items.map((col, index) => (
            <motion.div
              key={col.id || index}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="group bg-aera-bg rounded-2xl overflow-hidden border border-aera-champagne/45 shadow-sm hover:shadow-luxury hover:border-aera-accent/35 transition-all duration-300 flex flex-col h-full cursor-pointer"
            >
              {/* Image Block */}
              <div className="relative aspect-square w-full overflow-hidden bg-aera-champagne/10">
                <Image
                  src={normalizeMediaUrl(col.image)}
                  alt={col.imageAlt || col.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Body details */}
              <div className="p-4 flex flex-col items-center justify-center flex-grow text-center">
                <h3 className="font-heading text-sm font-semibold text-aera-ink group-hover:text-aera-accent transition-colors">
                  {col.title}
                </h3>
                <span className="font-sans text-[10px] text-aera-muted mt-1 uppercase tracking-wider">
                  {col.designCount} designs
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
export default FeaturedCollections;
