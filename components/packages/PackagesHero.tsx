"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { AnimatedButton } from "@/components/common/AnimatedButton";
import { Sparkle, OvalLine, Watermark, fadeUp, staggerContainer } from "@/components/common/FloatingOrnaments";
import { PackagesPageContent } from "@/types/packages";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

export function PackagesHero({ data }: { data: PackagesPageContent["hero"] }) {
  return (
    <section className="relative overflow-hidden bg-aera-bg pt-28 pb-16 md:pt-36 md:pb-24">
      {/* Background Ornaments */}
      <Watermark text="an" className="top-10 -right-20 -rotate-12 opacity-[0.02]" />
      <Sparkle className="top-24 left-1/3 text-aera-gold" delay={0.4} />
      <Sparkle className="bottom-1/4 left-10 text-aera-accent" delay={1.8} />
      <Sparkle className="top-1/3 right-1/4 text-aera-gold" delay={0.9} />

      <Container className="relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16"
        >
          {/* Left Side: Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.span
              variants={fadeUp}
              className="font-sans text-xs font-bold tracking-widest text-aera-accent uppercase mb-3"
            >
              {data.eyebrow}
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="font-heading text-4xl sm:text-5xl lg:text-6xl font-normal text-aera-ink leading-[1.15] mb-6"
            >
              {data.title}{" "}
              <span className="block font-heading italic text-aera-accent relative mt-1 lg:mt-2">
                {data.highlight}
                <OvalLine className="w-full h-[60%] -bottom-1 left-0 stroke-aera-accent/20" />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="font-sans text-xs sm:text-sm text-aera-muted max-w-xl mb-8 leading-relaxed"
            >
              {data.description}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 items-center">
              <AnimatedButton
                label={data.primaryButton.label}
                href={data.primaryButton.href}
                variant="primary"
                icon="arrow"
              />
              <AnimatedButton
                label={data.secondaryButton.label}
                href={data.secondaryButton.href}
                variant="secondary"
              />
            </motion.div>
          </div>

          {/* Right Side: Image Box */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="absolute w-[110%] h-[110%] border border-aera-accent/10 rounded-[3.5rem] -rotate-6 -z-10 pointer-events-none" />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.25 }}
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

            <Sparkle className="-top-5 -left-3 text-aera-accent" delay={1.1} />
            <Sparkle className="-bottom-5 -right-3 text-aera-gold" delay={2.3} />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
export default PackagesHero;
