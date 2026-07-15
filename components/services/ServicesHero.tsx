"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { AnimatedButton } from "@/components/common/AnimatedButton";
import { Sparkle, OvalLine, Watermark, fadeUp, staggerContainer } from "@/components/common/FloatingOrnaments";
import { ServicesPageContent } from "@/types/services";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

export function ServicesHero({ data }: { data: ServicesPageContent["hero"] }) {
  return (
    <section className="relative overflow-hidden bg-aera-bg pt-28 pb-16 md:pt-36 md:pb-24">
      {/* Background Ornaments */}
      <Watermark text="an" className="top-12 -left-20 rotate-12 opacity-[0.02]" />
      <Sparkle className="top-24 left-1/4" delay={0.5} />
      <Sparkle className="bottom-1/3 left-12" delay={2.1} />
      <Sparkle className="top-1/3 right-1/3" delay={1.2} />

      <Container className="relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16"
        >
          {/* Left Column: Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.span
              variants={fadeUp}
              className="font-sans text-xs font-bold tracking-widest text-aera-accent uppercase mb-3"
            >
              {data.eyebrow}
            </motion.span>
            
            <motion.h1
              variants={fadeUp}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-normal text-aera-ink leading-[1.1] mb-6"
            >
              {data.title}{" "}
              <span className="block font-heading italic text-aera-accent relative mt-1 lg:mt-2">
                {data.highlight}
                <OvalLine className="w-full h-[60%] -bottom-1 left-0 stroke-aera-accent/20" />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="font-sans text-base text-aera-muted max-w-xl mb-8 leading-relaxed"
            >
              {data.description}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-4 items-center"
            >
              <AnimatedButton
                label={data.primaryButton.label}
                href={data.primaryButton.href}
                variant="primary"
                icon="arrow-right"
              />
              <AnimatedButton
                label={data.secondaryButton.label}
                href={data.secondaryButton.href}
                variant="secondary"
              />
            </motion.div>
          </div>

          {/* Right Column: Hero Image Collage */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Decorative background oval */}
            <div className="absolute w-[110%] h-[110%] border border-aera-accent/10 rounded-[4rem] rotate-6 -z-10 pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="w-full max-w-[420px] aspect-[4/5] rounded-[3rem] overflow-hidden shadow-luxury border-4 border-aera-champagne relative"
            >
              <Image
                src={normalizeMediaUrl(data.image.src)}
                alt={data.image.alt}
                fill
                priority
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            {/* Sparkles Floating Around the Image */}
            <Sparkle className="-top-4 -right-2 text-aera-accent" delay={0.8} />
            <Sparkle className="-bottom-6 -left-4 text-aera-gold" delay={1.6} />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
export default ServicesHero;
