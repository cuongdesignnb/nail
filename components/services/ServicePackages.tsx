"use client";
import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { AnimatedButton } from "@/components/common/AnimatedButton";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { ServicePackageDTO } from "@/types/services";
import { Check } from "lucide-react";

export function ServicePackages({ items }: { items: ServicePackageDTO[] }) {
  return (
    <section className="bg-aera-champagne/10 py-20 relative">
      <Container>
        <SectionHeading
          eyebrow="MEMBERSHIPS & PACKAGES"
          title="Curated Packages & Offers"
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12"
        >
          {/* Left Column: 3 Packages Grid */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((pkg, index) => (
              <motion.div
                key={pkg.id || index}
                variants={fadeUp}
                className={`rounded-[2rem] p-6 md:p-8 border flex flex-col justify-between h-full relative transition-all duration-300 ${
                  pkg.isPopular
                    ? "bg-aera-bg border-aera-accent shadow-luxury ring-1 ring-aera-accent"
                    : "bg-aera-bg border-aera-champagne/40 shadow-sm hover:border-aera-accent/30"
                }`}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-aera-accent text-aera-bg font-sans text-[9px] font-bold tracking-widest uppercase py-1 px-4 rounded-full shadow-sm">
                    {pkg.badge || "MOST POPULAR"}
                  </span>
                )}

                <div>
                  <h3 className="font-heading text-lg font-normal text-aera-ink mb-1">
                    {pkg.name}
                  </h3>
                  <p className="font-sans text-[10px] text-aera-muted mb-4 leading-relaxed">
                    {pkg.subtitle}
                  </p>

                  <div className="flex items-baseline gap-1 mb-6 border-b border-aera-champagne/40 pb-4">
                    <span className="font-heading text-2xl md:text-3xl font-bold text-aera-accent">
                      {pkg.priceLabel || `$${pkg.price}`}
                    </span>
                  </div>

                  {/* Feature Bullets */}
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2 text-left">
                        <Check size={14} className="text-aera-accent shrink-0 mt-0.5" />
                        <span className="font-sans text-xs text-aera-muted leading-snug">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <AnimatedButton
                  label="Choose Plan"
                  href="/booking"
                  variant={pkg.isPopular ? "primary" : "secondary"}
                  className="w-full text-xs py-2.5"
                />
              </motion.div>
            ))}
          </div>

          {/* Right Column: First Visit Promo Card */}
          <motion.div
            variants={fadeUp}
            className="lg:col-span-3 rounded-[2rem] bg-aera-bg border border-aera-champagne/45 shadow-sm p-6 md:p-8 flex flex-col justify-between items-center text-center hover:shadow-luxury hover:border-aera-accent/30 transition-all duration-300 relative overflow-hidden"
          >
            {/* Soft backdrop ornament */}
            <div className="absolute w-36 h-36 rounded-full bg-aera-champagne/20 -top-12 -right-12 pointer-events-none" />

            <div>
              <span className="font-sans text-[10px] font-bold text-aera-accent tracking-widest uppercase mb-2 block">
                Special Offer
              </span>
              <h3 className="font-heading text-3xl font-bold text-aera-ink mb-1 mt-2">
                10% OFF
              </h3>
              <h4 className="font-heading text-base font-normal text-aera-accent mb-4">
                First Visit
              </h4>
              <p className="font-sans text-xs text-aera-muted leading-relaxed max-w-[160px] mx-auto mb-6">
                For all first-time guests. Walk-ins welcome!
              </p>
            </div>

            <AnimatedButton
              label="Book Now"
              href="/booking"
              variant="primary"
              className="w-full text-xs py-2.5"
            />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
export default ServicePackages;
