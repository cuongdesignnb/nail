"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { AnimatedButton } from "@/components/common/AnimatedButton";
import { Sparkles, Calendar, BadgeCheck, Gem, LucideIcon } from "lucide-react";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { PackagesPageContent } from "@/types/packages";

const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  calendar: Calendar,
  "badge-check": BadgeCheck,
  gem: Gem,
};

export function PackageBenefits({ data }: { data: PackagesPageContent["benefits"] }) {
  return (
    <section id="benefits" className="relative bg-aera-cream py-20 overflow-hidden">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left: Collage Box */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4 relative">
            <div className="space-y-4">
              <motion.div
                variants={fadeUp}
                className="rounded-[2.5rem] overflow-hidden aspect-[4/5] relative shadow-md border-2 border-white"
              >
                <Image
                  src={data.image.src}
                  alt={data.image.alt}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
            <div className="space-y-4 pt-8">
              <motion.div
                variants={fadeUp}
                className="rounded-[2.5rem] overflow-hidden aspect-[4/5] relative shadow-md border-2 border-white"
              >
                <Image
                  src="/images/about-nail-detail.jpg"
                  alt="Nail detailing polish close up"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>

          {/* Right: Content & Benefits list */}
          <div className="lg:col-span-6 text-left">
            <motion.span
              variants={fadeUp}
              className="font-sans text-xs font-bold tracking-widest text-aera-accent uppercase mb-2 block"
            >
              {data.eyebrow}
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-heading text-3xl md:text-4xl font-normal text-aera-ink leading-tight mb-4"
            >
              {data.title}
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="font-sans text-xs md:text-sm text-aera-muted mb-8 leading-relaxed"
            >
              {data.description}
            </motion.p>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              {data.items.map((benefit, index) => {
                const IconComp = iconMap[benefit.icon || ""] || Sparkles;
                return (
                  <motion.div
                    key={benefit.id || index}
                    variants={fadeUp}
                    className="flex gap-3 text-left"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-aera-accent/10 flex items-center justify-center text-aera-accent shrink-0 mt-0.5">
                      <IconComp size={18} />
                    </div>
                    <div>
                      <h4 className="font-heading text-xs font-semibold text-aera-ink mb-1">
                        {benefit.title}
                      </h4>
                      <p className="font-sans text-[11px] text-aera-muted leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div variants={fadeUp}>
              <AnimatedButton
                label={data.button.label}
                href={data.button.href}
                variant="primary"
                icon="arrow"
              />
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
export default PackageBenefits;
