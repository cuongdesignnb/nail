"use client";
import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { MousePointer, CalendarDays, Sparkles, Smile, LucideIcon } from "lucide-react";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { PackageProcessStepDTO } from "@/types/packages";

const iconMap: Record<string, LucideIcon> = {
  "mouse-pointer": MousePointer,
  "calendar-days": CalendarDays,
  sparkles: Sparkles,
  smile: Smile,
};

export function PackageProcess({ data }: { data: { title: string; steps: PackageProcessStepDTO[] } }) {
  return (
    <section className="bg-aera-cream py-20 relative overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow="SIMPLE RITUAL"
          title={data.title}
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 relative"
        >
          {/* Dotted Connection Line (Desktop) */}
          <div className="absolute top-[32px] left-[12%] right-[12%] h-[1px] border-t-2 border-dashed border-aera-accent/15 hidden lg:block z-0 pointer-events-none" />

          {data.steps.map((step, index) => {
            const IconComp = iconMap[step.icon || ""] || Sparkles;
            return (
              <motion.div
                key={step.id || index}
                variants={fadeUp}
                className="flex flex-col items-center text-center relative z-10"
              >
                {/* Step indicator balloon */}
                <div className="w-[14px] h-[14px] rounded-full bg-aera-accent flex items-center justify-center text-[8px] text-white font-bold mb-4 font-sans shadow-sm ring-4 ring-aera-cream" />

                {/* Icon wrapper */}
                <div className="w-14 h-14 rounded-3xl bg-white border border-aera-champagne/30 text-aera-accent flex items-center justify-center mb-6 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <IconComp size={20} />
                </div>

                {/* Indicator text */}
                <span className="font-sans text-[10px] text-aera-accent font-bold tracking-widest uppercase mb-1">
                  Step {step.step}
                </span>

                {/* Title & Desc */}
                <h4 className="font-heading text-xs font-semibold text-aera-ink mb-2">
                  {step.title}
                </h4>
                <p className="font-sans text-[11px] text-aera-muted leading-relaxed max-w-[200px]">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
export default PackageProcess;
