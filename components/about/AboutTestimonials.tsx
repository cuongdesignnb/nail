"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AboutPageContent } from "@/types/about";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Star, Quote } from "lucide-react";
import { fadeUp, staggerContainer } from "@/components/common/FloatingOrnaments";

interface AboutTestimonialsProps {
  data: AboutPageContent["testimonials"];
}

export function AboutTestimonials({ data }: AboutTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-white py-20 md:py-24 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-1/4 -right-16 text-[15rem] font-serif text-aera-accent/[0.03] select-none pointer-events-none">
        ”
      </div>
      <div className="absolute bottom-1/4 -left-16 text-[15rem] font-serif text-aera-accent/[0.03] select-none pointer-events-none">
        “
      </div>

      <Container>
        {/* Title */}
        <SectionHeading eyebrow={data.eyebrow} title="What Our Clients Say" />

        {/* Testimonials layout (showing up to 2 items horizontally, or single sliding item) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto"
        >
          {data.items.slice(0, 2).map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={fadeUp}
              className="bg-[#FFFDF8] rounded-[24px] p-8 md:p-10 border border-aera-accent/5 hover:border-aera-accent/15 shadow-luxury transition-all duration-300 relative group flex flex-col justify-between text-left"
            >
              {/* Backquote watermark */}
              <Quote className="absolute top-8 right-8 w-12 h-12 text-aera-accent/[0.03] group-hover:text-aera-accent/[0.07] transition-colors duration-500" />

              <div>
                {/* Stars Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={
                        i < testimonial.rating
                          ? "fill-aera-gold text-aera-gold"
                          : "text-aera-accent/20"
                      }
                    />
                  ))}
                </div>

                {/* Quote copy */}
                <p className="font-sans text-sm md:text-base text-aera-ink/90 leading-relaxed italic mb-8 relative z-10">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

              </div>

              {/* Client Info */}
              <div className="flex items-center gap-4 mt-auto">
                {testimonial.avatar ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <Image
                      src={testimonial.avatar.src}
                      alt={testimonial.avatar.alt}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-aera-champagne flex items-center justify-center text-aera-accent font-bold font-sans">
                    {testimonial.name.slice(0, 1)}
                  </div>
                )}
                <div className="flex flex-col">
                  <strong className="font-sans text-sm text-aera-ink font-semibold">
                    {testimonial.name}
                  </strong>
                  <span className="font-sans text-xs text-aera-muted mt-0.5">
                    {testimonial.role || "Verified Client"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Carousel indicators simulation */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {Array.from({ length: Math.max(2, data.items.length) }).map((_, idx) => (
            <button
              key={idx}
              aria-label={`Slide ${idx + 1}`}
              onClick={() => setActiveIndex(idx % data.items.length)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "bg-aera-accent w-6"
                  : "bg-aera-accent/20 hover:bg-aera-accent/40"
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
export default AboutTestimonials;
