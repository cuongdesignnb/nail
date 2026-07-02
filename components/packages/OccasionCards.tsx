"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Sparkles, Heart, Gift, Gem, LucideIcon } from "lucide-react";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { PackageOccasionDTO } from "@/types/packages";

const iconMap: Record<string, LucideIcon> = {
  gem: Gem,
  sparkles: Sparkles,
  heart: Heart,
  gift: Gift,
};

export function OccasionCards({ data }: { data: { title: string; items: PackageOccasionDTO[] } }) {
  return (
    <section className="bg-aera-bg py-20">
      <Container>
        <SectionHeading
          eyebrow="PERFECT MOMENTS"
          title={data.title}
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
        >
          {data.items.map((occ, index) => {
            const IconComp = iconMap[occ.icon || ""] || Sparkles;
            return (
              <motion.div
                key={occ.id || index}
                variants={fadeUp}
                className="group relative rounded-[2.5rem] overflow-hidden border border-aera-champagne/30 bg-white hover:border-aera-accent/30 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col h-full text-left"
              >
                {/* Occasion Image */}
                {occ.image && (
                  <div className="relative w-full aspect-[4/3] bg-aera-champagne/15 overflow-hidden">
                    <Image
                      src={occ.image}
                      alt={occ.imageAlt || occ.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content Box */}
                <div className="p-6 flex flex-col justify-start items-start relative z-10 flex-grow">
                  <div className="w-9 h-9 rounded-2xl bg-aera-accent/10 text-aera-accent flex items-center justify-center mb-3">
                    <IconComp size={16} />
                  </div>
                  <h4 className="font-heading text-xs font-semibold text-aera-ink mb-1 group-hover:text-aera-accent transition-colors">
                    {occ.title}
                  </h4>
                  <p className="font-sans text-[11px] text-aera-muted leading-relaxed">
                    {occ.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
export default OccasionCards;
