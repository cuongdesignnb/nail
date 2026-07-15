"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Percent, Calendar, Gift, Gem, LucideIcon } from "lucide-react";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { PackagesPageContent } from "@/types/packages";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

const iconMap: Record<string, LucideIcon> = {
  percent: Percent,
  calendar: Calendar,
  gift: Gift,
  gem: Gem,
};

export function MembershipRewards({ data }: { data: PackagesPageContent["rewards"] }) {
  return (
    <section className="bg-aera-bg py-20 relative overflow-hidden">
      <Container>
        <SectionHeading
          eyebrow="LOYAL PERKS"
          title={data.title}
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 items-stretch"
        >
          {/* Left: Perks list (7 columns) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {data.items.map((rew, index) => {
              const IconComp = iconMap[rew.icon || ""] || Gem;
              return (
                <motion.div
                  key={rew.id || index}
                  variants={fadeUp}
                  className="bg-white p-6 rounded-[2rem] border border-aera-champagne/30 shadow-sm flex flex-col justify-start text-left hover:shadow-luxury hover:border-aera-accent/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-2xl bg-aera-accent/10 flex items-center justify-center text-aera-accent mb-4">
                    <IconComp size={20} />
                  </div>
                  <h4 className="font-heading text-sm font-semibold text-aera-ink mb-2">
                    {rew.title}
                  </h4>
                  <p className="font-sans text-xs text-aera-muted leading-relaxed">
                    {rew.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Join & Save Promo Card (5 columns) */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-5 bg-aera-cream rounded-[2.5rem] p-8 border border-aera-accent/20 flex flex-col justify-between items-center text-center relative overflow-hidden shadow-luxury min-h-[360px]"
          >
            {/* Promo image background or vignette */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-6 border border-white/60 shadow-sm">
              <Image
                src={normalizeMediaUrl(data.promo.image?.src) || "/images/about-hero-nail.jpg"}
                alt={data.promo.image?.alt || "Promo offer"}
                fill
                className="object-cover"
              />
            </div>

            <div className="relative z-10 flex-grow flex flex-col items-center justify-center">
              <span className="font-sans text-[10px] text-aera-muted tracking-widest uppercase font-bold mb-1">
                {data.promo.title}
              </span>
              <h3 className="font-heading text-4xl font-normal text-aera-accent mb-2">
                {data.promo.value}
              </h3>
              <p className="font-sans text-xs text-aera-muted max-w-xs mb-6 leading-relaxed">
                {data.promo.description}
              </p>
            </div>

            <a
              href={data.promo.button.href}
              className="relative z-10 w-full inline-flex items-center justify-center bg-aera-accent hover:bg-aera-accentHover text-white py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 decoration-none cursor-pointer border-none shadow-sm"
            >
              {data.promo.button.label}
            </a>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
export default MembershipRewards;
