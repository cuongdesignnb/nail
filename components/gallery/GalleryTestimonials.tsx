"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Star } from "lucide-react";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { GalleryTestimonialDTO } from "@/types/gallery";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

export function GalleryTestimonials({ items }: { items: GalleryTestimonialDTO[] }) {
  return (
    <section className="bg-aera-bg py-20 relative">
      <Container>
        <SectionHeading
          eyebrow="CLIENT REVIEWS"
          title="What Our Clients Say"
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {items.map((test, index) => (
            <motion.div
              key={test.id || index}
              variants={fadeUp}
              className="bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-sm hover:shadow-luxury hover:border-aera-accent/25 transition-all duration-300 relative flex flex-col justify-between text-left h-full group"
            >
              {/* Giant quote watermark */}
              <span className="absolute right-6 top-4 font-heading text-[6rem] text-aera-champagne/25 leading-none select-none pointer-events-none group-hover:text-aera-accent/15 transition-colors">
                ”
              </span>

              <div className="relative z-10">
                {/* Rating stars */}
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      size={13}
                      className={
                        sIdx < test.rating
                          ? "fill-aera-gold text-aera-gold"
                          : "text-aera-champagne"
                      }
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="font-sans text-xs md:text-sm text-aera-muted leading-relaxed italic mb-8">
                  &quot;{test.quote}&quot;
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-aera-champagne/15 border border-aera-champagne/30">
                  <Image
                    src={normalizeMediaUrl(test.avatar) || "/images/client-1.jpg"}
                    alt={test.avatarAlt || test.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-heading text-xs font-semibold text-aera-ink leading-tight">
                    {test.name}
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
export default GalleryTestimonials;
