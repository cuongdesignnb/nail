"use client";
import React from "react";
import { motion } from "framer-motion";
import { AboutPageContent } from "@/types/about";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { getIcon } from "@/lib/icons";
import { fadeUp, staggerContainer } from "@/components/common/FloatingOrnaments";

interface ProcessSectionProps {
  data: AboutPageContent["process"];
}

export function ProcessSection({ data }: ProcessSectionProps) {
  return (
    <section className="bg-aera-champagne/10 py-20 md:py-24 relative overflow-hidden">
      <Container>
        {/* Title */}
        <SectionHeading eyebrow={data.eyebrow} title="Our Process" />

        {/* Process Roadmap */}
        <div className="relative mt-8">
          
          {/* Desktop Dotted Connector Line */}
          <div className="hidden lg:block absolute top-[45px] left-[12%] right-[12%] h-[1.5px] border-t-2 border-dashed border-aera-accent/25 z-0" />

          {/* Steps Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10"
          >
            {data.steps.map((step, idx) => {
              const StepIcon = getIcon(step.icon);
              return (
                <motion.div
                  key={step.id}
                  variants={fadeUp}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Step bubble and number overlay */}
                  <div className="relative mb-6">
                    {/* Circle wrapper */}
                    <div className="w-20 h-20 rounded-full bg-white border border-aera-accent/15 group-hover:border-aera-accent group-hover:bg-aera-accent group-hover:text-white flex items-center justify-center text-aera-accent shadow-luxury transition-all duration-500 relative">
                      <StepIcon size={30} strokeWidth={1.5} />
                    </div>

                    {/* Step number badge */}
                    <span className="absolute -top-1.5 -left-1.5 w-7 h-7 rounded-full bg-aera-accent/10 border border-aera-accent text-aera-accent group-hover:bg-white group-hover:text-aera-accent text-xs font-bold font-sans flex items-center justify-center transition-all duration-500">
                      {step.step}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-lg text-aera-ink font-semibold mb-2 group-hover:text-aera-accent transition-colors duration-300">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="font-sans text-xs md:text-sm text-aera-muted leading-relaxed max-w-[240px]">
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
export default ProcessSection;
