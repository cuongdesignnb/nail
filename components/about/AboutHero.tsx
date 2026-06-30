"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AboutPageContent } from "@/types/about";
import { Container } from "@/components/common/Container";
import { AnimatedButton } from "@/components/common/AnimatedButton";
import { Sparkle, OvalLine, Watermark, fadeUp, fadeLeft } from "@/components/common/FloatingOrnaments";

interface AboutHeroProps {
  data: AboutPageContent["hero"];
}

export function AboutHero({ data }: AboutHeroProps) {
  return (
    <section className="relative overflow-hidden bg-aera-bg pt-12 pb-20 md:py-24 lg:py-32 flex items-center min-h-[85vh]">
      {/* Background Ornaments */}
      {data.watermark && (
        <Watermark text={data.watermark} className="top-10 left-1/2 -translate-x-1/2" />
      )}
      <OvalLine className="w-[600px] h-[300px] -top-12 -left-12 opacity-50" />
      <OvalLine className="w-[450px] h-[220px] bottom-10 right-10 rotate-45 opacity-40" />
      <Sparkle className="top-1/4 left-10 md:left-24 text-xl" delay={0.5} />
      <Sparkle className="bottom-1/3 right-12 md:right-32 text-lg" delay={1.8} />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Text Column */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } }
            }}
            className="flex flex-col text-left"
          >
            {data.eyebrow && (
              <motion.span
                variants={fadeUp}
                transition={{ duration: 0.6 }}
                className="text-xs md:text-sm font-bold tracking-[0.25em] text-aera-accent uppercase mb-4 font-sans"
              >
                {data.eyebrow}
              </motion.span>
            )}

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="font-heading font-normal text-4xl md:text-5xl lg:text-6xl text-aera-ink leading-[1.1] mb-6"
            >
              {data.title}{" "}
              <span className="italic text-aera-accent font-heading block sm:inline mt-1 sm:mt-0">
                {data.highlightText}
              </span>
              <span className="block mt-2 font-normal text-3xl md:text-4xl lg:text-5xl text-aera-ink/90">
                Come Together
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="font-sans text-sm md:text-base text-aera-muted leading-relaxed max-w-xl mb-10"
            >
              {data.description}
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.8 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5"
            >
              {data.primaryButton && (
                <AnimatedButton
                  label={data.primaryButton.label}
                  href={data.primaryButton.href}
                  variant={data.primaryButton.variant || "primary"}
                  icon={data.primaryButton.icon}
                />
              )}
              {data.secondaryButton && (
                <AnimatedButton
                  label={data.secondaryButton.label}
                  href={data.secondaryButton.href}
                  variant={data.secondaryButton.variant || "secondary"}
                  icon={data.secondaryButton.icon}
                />
              )}
            </motion.div>
          </motion.div>

          {/* Right Image Column */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeLeft}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center lg:justify-end"
          >
            {/* Elegant Image Border Wrapper */}
            <div className="relative w-full max-w-[480px] aspect-[4/5] rounded-[60px] rounded-tl-[180px] rounded-br-[180px] overflow-hidden border-[8px] border-white shadow-luxury">
              <Image
                src={data.image.src}
                alt={data.image.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            
            {/* Sparkle Decoration floating above image corner */}
            <div className="absolute -top-4 left-6 md:-left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md animate-bounce" style={{ animationDuration: "3s" }}>
              <span className="text-aera-accent text-xl">✦</span>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
export default AboutHero;
