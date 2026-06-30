"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AboutPageContent } from "@/types/about";
import { Container } from "@/components/common/Container";
import { getIcon } from "@/lib/icons";
import { fadeUp, fadeRight, staggerContainer } from "@/components/common/FloatingOrnaments";

interface OurStoryProps {
  data: AboutPageContent["story"];
}

export function OurStory({ data }: OurStoryProps) {
  const StatIcon = getIcon(data.statCard.icon);

  return (
    <section className="bg-white py-20 md:py-28 relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          
          {/* Left: Image Collage */}
          <div className="lg:col-span-6 relative flex flex-col items-center">
            
            {/* Primary Large Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeRight}
              transition={{ duration: 0.8 }}
              className="relative w-[75%] aspect-[3/4] rounded-[28px] overflow-hidden border-4 border-white shadow-luxury mr-auto"
            >
              <Image
                src={data.images[0].src}
                alt={data.images[0].alt}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>

            {/* Overlapping Small Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute w-[50%] aspect-square rounded-[28px] overflow-hidden border-[6px] border-white shadow-luxury bottom-[-20px] right-2 z-10"
            >
              <Image
                src={data.images[1].src}
                alt={data.images[1].alt}
                fill
                sizes="(max-width: 768px) 50vw, 250px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </motion.div>

            {/* Floating Stat Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.4 }}
              className="absolute left-6 bottom-[10%] bg-white rounded-[24px] py-4 px-6 shadow-luxury border border-aera-accent/10 flex items-center gap-4 z-20"
            >
              <div className="w-12 h-12 rounded-full bg-aera-champagne flex items-center justify-center text-aera-accent">
                <StatIcon size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-[11px] font-bold tracking-wider text-aera-muted uppercase leading-none mb-1">
                  Over
                </span>
                <strong className="font-sans text-xl md:text-2xl text-aera-ink font-extrabold leading-none">
                  {data.statCard.value}
                </strong>
                <span className="font-sans text-[11px] text-aera-muted mt-1 leading-none">
                  {data.statCard.label}
                </span>
              </div>
            </motion.div>

          </div>

          {/* Right: Content details */}
          <div className="lg:col-span-6 flex flex-col text-left">
            <span className="text-xs md:text-sm font-bold tracking-[0.25em] text-aera-accent uppercase mb-4 font-sans">
              {data.eyebrow}
            </span>
            <h2 className="font-heading font-normal text-3xl md:text-4xl lg:text-5xl text-aera-ink leading-tight mb-6">
              {data.title}
            </h2>

            <div className="flex flex-col gap-5 mb-10">
              {data.paragraphs.map((para, idx) => (
                <p key={idx} className="font-sans text-sm md:text-base text-aera-muted leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            {/* highlights */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-aera-accent/15"
            >
              {data.highlights.map((highlight) => {
                const HighlightIcon = getIcon(highlight.icon);
                return (
                  <motion.div
                    key={highlight.id}
                    variants={fadeUp}
                    className="flex flex-col text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-aera-champagne/60 group-hover:bg-aera-accent group-hover:text-white flex items-center justify-center text-aera-accent transition-all duration-300 mb-3.5">
                      <HighlightIcon size={18} />
                    </div>
                    <h3 className="font-heading text-base text-aera-ink font-semibold mb-1">
                      {highlight.title}
                    </h3>
                    <p className="font-sans text-xs text-aera-muted leading-relaxed">
                      {highlight.description}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>

          </div>

        </div>
      </Container>
    </section>
  );
}
export default OurStory;
