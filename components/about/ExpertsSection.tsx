"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AboutPageContent } from "@/types/about";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Instagram, Facebook, Share2 } from "lucide-react";
import { fadeUp, staggerContainer } from "@/components/common/FloatingOrnaments";

interface ExpertsSectionProps {
  data: AboutPageContent["experts"];
}

export function ExpertsSection({ data }: ExpertsSectionProps) {
  return (
    <section className="bg-aera-champagne/10 py-20 md:py-24 relative overflow-hidden">
      <Container>
        {/* Title */}
        <SectionHeading eyebrow={data.eyebrow} title={data.title} />

        {/* Members Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {data.members.map((member) => (
            <motion.div
              key={member.id}
              variants={fadeUp}
              className="flex flex-col text-center group"
            >
              {/* Member Image Wrapper */}
              <div className="relative w-full aspect-[3/4] rounded-[24px] overflow-hidden border-[6px] border-white shadow-luxury mb-5">
                <Image
                  src={member.avatar.src}
                  alt={member.avatar.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Social Overlay on Hover (optional / mobile fallback) */}
                <div className="absolute inset-0 bg-gradient-to-t from-aera-ink/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                  <span className="text-white text-xs tracking-wider uppercase font-semibold">
                    Aera Artist
                  </span>
                </div>
              </div>

              {/* Name & Role */}
              <h3 className="font-heading text-lg md:text-xl text-aera-ink font-semibold mb-1">
                {member.name}
              </h3>
              <p className="font-sans text-xs text-aera-muted tracking-wider uppercase mb-3">
                {member.role}
              </p>

              {/* Social Channels */}
              <div className="flex items-center justify-center gap-3 mt-1">
                {member.socials?.instagram ? (
                  <a
                    href={member.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full border border-aera-accent/20 hover:border-aera-accent hover:bg-aera-accent hover:text-white text-aera-accent flex items-center justify-center transition-all duration-300"
                  >
                    <Instagram size={13} />
                  </a>
                ) : null}
                {member.socials?.facebook ? (
                  <a
                    href={member.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full border border-aera-accent/20 hover:border-aera-accent hover:bg-aera-accent hover:text-white text-aera-accent flex items-center justify-center transition-all duration-300"
                  >
                    <Facebook size={13} />
                  </a>
                ) : null}
                {!member.socials?.instagram && !member.socials?.facebook && (
                  <div className="w-8 h-8 rounded-full border border-aera-accent/10 flex items-center justify-center text-aera-accent/40">
                    <Share2 size={13} />
                  </div>
                )}
              </div>

            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
export default ExpertsSection;
