"use client";
import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { AnimatedButton } from "@/components/common/AnimatedButton";
import { Phone, MapPin, Clock } from "lucide-react";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { GalleryPageContent } from "@/types/gallery";

export function GalleryCTA({ data }: { data: GalleryPageContent["cta"] }) {
  return (
    <section className="bg-aera-bg py-16 md:py-20 relative overflow-hidden">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white rounded-[2.5rem] border border-aera-champagne/45 p-8 md:p-12 shadow-luxury text-center relative overflow-hidden max-w-4xl mx-auto"
        >
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-aera-champagne/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <motion.h2
            variants={fadeUp}
            className="font-heading text-2xl md:text-3xl font-normal text-aera-ink mb-3"
          >
            {data.title}
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="font-sans text-xs md:text-sm text-aera-muted max-w-xl mx-auto mb-8 leading-relaxed"
          >
            {data.description}
          </motion.p>

          {/* Quick Contact Block Info */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left border-y border-aera-champagne/40 py-6 mb-8 max-w-2xl mx-auto"
          >
            <div className="flex gap-2.5 items-start">
              <Phone size={14} className="text-aera-accent shrink-0 mt-0.5" />
              <div>
                <h5 className="font-heading text-[10px] uppercase tracking-wider text-aera-ink font-semibold mb-0.5">
                  Phone
                </h5>
                <p className="font-sans text-[11px] text-aera-muted">{data.phone}</p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <MapPin size={14} className="text-aera-accent shrink-0 mt-0.5" />
              <div>
                <h5 className="font-heading text-[10px] uppercase tracking-wider text-aera-ink font-semibold mb-0.5">
                  Location
                </h5>
                <p className="font-sans text-[11px] text-aera-muted leading-snug">
                  {data.address}
                </p>
              </div>
            </div>

            <div className="flex gap-2.5 items-start">
              <Clock size={14} className="text-aera-accent shrink-0 mt-0.5" />
              <div>
                <h5 className="font-heading text-[10px] uppercase tracking-wider text-aera-ink font-semibold mb-0.5">
                  Hours
                </h5>
                <p className="font-sans text-[11px] text-aera-muted">{data.hours}</p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex justify-center">
            <AnimatedButton
              label={data.button.label}
              href={data.button.href}
              variant="primary"
            />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
export default GalleryCTA;
