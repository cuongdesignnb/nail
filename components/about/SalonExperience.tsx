"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AboutPageContent } from "@/types/about";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { fadeUp, staggerContainer } from "@/components/common/FloatingOrnaments";

interface SalonExperienceProps {
  data: AboutPageContent["salonExperience"];
}

export function SalonExperience({ data }: SalonExperienceProps) {
  return (
    <section className="bg-white py-20 md:py-24 relative overflow-hidden">
      <Container>
        {/* Title */}
        <SectionHeading eyebrow={data.eyebrow} title="Our Salon Experience" />
      </Container>

      {/* Grid container with responsive column splits */}
      <div className="px-4 md:px-8 max-w-[1560px] mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {data.images.map((item) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className="relative aspect-square rounded-[20px] overflow-hidden group shadow-md"
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 250px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-aera-ink/65 via-aera-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 text-left">
                {item.title && (
                  <h4 className="font-heading text-sm md:text-base text-white font-medium transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    {item.title}
                  </h4>
                )}
                <span className="font-sans text-[10px] text-aera-champagne/80 tracking-wider uppercase mt-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                  Aera Lounge
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
export default SalonExperience;
