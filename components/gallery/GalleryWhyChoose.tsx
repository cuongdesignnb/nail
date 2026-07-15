"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { AnimatedButton } from "@/components/common/AnimatedButton";
import { getIcon } from "@/lib/icons";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { GalleryPageContent } from "@/types/gallery";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

export function GalleryWhyChoose({ data }: { data: GalleryPageContent["whyChoose"] }) {
  return (
    <section className="bg-aera-champagne/10 py-20 relative overflow-hidden">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column: Image Collage */}
          <div className="lg:col-span-6 relative grid grid-cols-12 gap-4">
            <motion.div
              variants={fadeUp}
              className="col-span-8 aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-luxury border-4 border-aera-bg relative"
            >
              <Image
                src={normalizeMediaUrl(data.image.src) || "/images/about-salon.jpg"}
                alt={data.image.alt || "Luxury Salon"}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            <div className="col-span-4 flex flex-col gap-4 justify-between h-full pt-10">
              <motion.div
                variants={fadeUp}
                className="aspect-square rounded-[1.5rem] overflow-hidden shadow-luxury border-2 border-aera-bg relative"
              >
                <Image
                  src="/images/about-nail-detail.jpg"
                  alt="Nail Art Design"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="aspect-square rounded-[1.5rem] overflow-hidden shadow-luxury border-2 border-aera-bg relative"
              >
                <Image
                  src="/images/salon-experience-2.jpg"
                  alt="Manicure Session"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            </div>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <SectionHeading
              eyebrow={data.eyebrow}
              title={data.title}
              align="left"
              sparkle={false}
              className="!mb-6"
            />
            
            <p className="font-sans text-sm text-aera-muted mb-8 leading-relaxed">
              {data.description}
            </p>

            {/* Features list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-10">
              {data.features.map((feat, fIndex) => {
                const IconComp = getIcon(feat.icon);
                return (
                  <motion.div
                    key={feat.id || fIndex}
                    variants={fadeUp}
                    className="flex gap-3.5"
                  >
                    <div className="w-9 h-9 rounded-full bg-aera-accent/10 text-aera-accent flex items-center justify-center shrink-0">
                      <IconComp size={16} />
                    </div>
                    <div>
                      <h4 className="font-heading text-sm font-semibold text-aera-ink mb-1">
                        {feat.title}
                      </h4>
                      <p className="font-sans text-[11px] text-aera-muted leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div variants={fadeUp}>
              <AnimatedButton
                label="Learn More About Our Salon"
                href="/about"
                variant="secondary"
              />
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
export default GalleryWhyChoose;
