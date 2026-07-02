"use client";
import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Star } from "lucide-react";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { PageTestimonialDTO } from "@/types/packages";

export function PackageTestimonials({ data }: { data: { title: string; items: PageTestimonialDTO[] } }) {
  return (
    <section className="bg-aera-bg py-20 relative overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow="CLIENT REVIEWS"
          title={data.title}
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 text-left"
        >
          {data.items.map((test, index) => (
            <motion.div
              key={test.id || index}
              variants={fadeUp}
              className="bg-white p-8 rounded-[2.5rem] border border-aera-champagne/30 shadow-sm flex flex-col justify-between hover:shadow-luxury hover:border-aera-accent/30 transition-all duration-300"
            >
              <div>
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
              <div className="flex items-center gap-3 relative z-10 pt-4 border-t border-aera-champagne/20">
                <div>
                  <h4 className="font-heading text-xs font-semibold text-aera-ink">
                    {test.name}
                  </h4>
                  {test.role && (
                    <span className="font-sans text-[10px] text-aera-accent tracking-wider uppercase font-semibold block mt-0.5">
                      {test.role}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
export default PackageTestimonials;
