"use client";
import React from "react";
import { motion } from "framer-motion";
import { IconCard } from "@/types/about";
import { Container } from "@/components/common/Container";
import { getIcon } from "@/lib/icons";
import { fadeUp, staggerContainer } from "@/components/common/FloatingOrnaments";

interface MissionVisionValuesProps {
  items: IconCard[];
}

export function MissionVisionValues({ items }: MissionVisionValuesProps) {
  return (
    <section className="bg-aera-champagne/10 py-20 relative overflow-hidden">
      {/* Decorative vector arches */}
      <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-white to-transparent pointer-events-none" />

      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
        >
          {items.map((item) => {
            const CardIcon = getIcon(item.icon);
            return (
              <motion.div
                key={item.id}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                className="bg-white rounded-[24px] p-8 md:p-10 border border-aera-accent/10 hover:border-aera-accent/40 shadow-luxury transition-all duration-300 relative group flex flex-col text-left"
              >
                {/* Top Right Sparkle */}
                <span className="absolute top-6 right-6 text-aera-gold/30 group-hover:text-aera-gold text-lg transition-colors duration-300">
                  ✦
                </span>

                {/* Icon wrapper */}
                <div className="w-14 h-14 rounded-full bg-aera-champagne/40 text-aera-accent flex items-center justify-center mb-6 group-hover:bg-aera-accent group-hover:text-white transition-all duration-500">
                  <CardIcon size={24} strokeWidth={1.5} />
                </div>

                <h3 className="font-heading text-xl md:text-2xl text-aera-ink font-semibold mb-4">
                  {item.title}
                </h3>
                
                <p className="font-sans text-sm text-aera-muted leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>

      <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
export default MissionVisionValues;
