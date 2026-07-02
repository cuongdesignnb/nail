"use client";
import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { getIcon } from "@/lib/icons";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { GalleryProcessStepDTO } from "@/types/gallery";

export function GalleryProcess({ items }: { items: GalleryProcessStepDTO[] }) {
  return (
    <section className="bg-aera-champagne/10 py-20 relative overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow="OUR CREATIVE PROCESS"
          title="From Inspiration to Perfection"
          align="center"
        />

        <div className="relative">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-[44px] left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-aera-accent/20 z-0" />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 relative z-10"
          >
            {items.map((step, index) => {
              const IconComp = getIcon(step.icon || "sparkles");
              return (
                <motion.div
                  key={step.id || index}
                  variants={fadeUp}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Icon Circle */}
                  <div className="w-14 h-14 rounded-full bg-aera-bg border border-aera-champagne text-aera-accent flex items-center justify-center font-heading text-lg font-medium shadow-sm mb-5 group-hover:bg-aera-accent group-hover:text-aera-bg group-hover:border-aera-accent transition-all duration-300 relative">
                    <span className="text-[10px] text-aera-muted group-hover:text-aera-bg/85 absolute -top-4 font-sans tracking-widest font-bold">
                      {step.step}
                    </span>
                    <IconComp size={18} className="stroke-[1.5]" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading text-base font-semibold text-aera-ink mb-2">
                    {step.title}
                  </h3>
                  <p className="font-sans text-xs text-aera-muted leading-relaxed max-w-[240px]">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
export default GalleryProcess;
