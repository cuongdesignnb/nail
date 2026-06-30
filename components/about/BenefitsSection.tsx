"use client";
import React from "react";
import { motion } from "framer-motion";
import { AboutPageContent } from "@/types/about";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { getIcon } from "@/lib/icons";
import { fadeUp, staggerContainer } from "@/components/common/FloatingOrnaments";

interface BenefitsSectionProps {
  data: AboutPageContent["benefits"];
}

export function BenefitsSection({ data }: BenefitsSectionProps) {
  return (
    <section className="bg-white py-20 md:py-24 relative overflow-hidden">
      <Container>
        {/* Section Title */}
        <SectionHeading eyebrow={data.eyebrow} title="Why Clients Love Us" />

        {/* Benefits Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {data.items.map((item) => {
            const BenefitIcon = getIcon(item.icon);
            return (
              <motion.div
                key={item.id}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="bg-[#FFFDF8] rounded-[20px] p-6 md:p-8 border border-aera-accent/5 hover:border-aera-accent/20 hover:shadow-luxury transition-all duration-300 flex flex-col text-left group"
              >
                <div className="w-11 h-11 rounded-full bg-aera-champagne/50 text-aera-accent flex items-center justify-center mb-5 group-hover:bg-aera-accent group-hover:text-white transition-all duration-300">
                  <BenefitIcon size={20} />
                </div>
                <h3 className="font-heading text-lg text-aera-ink font-semibold mb-2">
                  {item.title}
                </h3>
                <p className="font-sans text-xs md:text-sm text-aera-muted leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
export default BenefitsSection;
