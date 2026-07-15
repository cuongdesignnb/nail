"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Check, Clock, Calendar } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { NailPackageDTO } from "@/types/packages";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

function PackagesListGrid({ packages }: { packages: NailPackageDTO[] }) {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "all";

  // Filter logic
  const filteredPackages =
    activeTab === "all"
      ? packages
      : packages.filter(
          (pkg) =>
            pkg.categoryId === activeTab ||
            pkg.subtitle?.toLowerCase() === activeTab.toLowerCase()
        );

  return (
    <section className="bg-aera-bg py-12">
      <Container>
        <SectionHeading
          eyebrow="CHOOSE YOUR EXPERIENCE"
          title="Featured Packages"
          align="center"
        />

        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10"
        >
          <AnimatePresence mode="popLayout">
            {filteredPackages.map((pkg, index) => {
              const isPopular = pkg.isPopular;
              return (
                <motion.div
                  key={pkg.id || index}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className={`group relative bg-white rounded-[2.5rem] overflow-hidden border transition-all duration-300 flex flex-col justify-between text-left h-full ${
                    isPopular
                      ? "border-aera-accent shadow-luxury ring-1 ring-aera-accent/30"
                      : "border-aera-champagne/45 shadow-sm hover:shadow-luxury hover:border-aera-accent/35"
                  }`}
                >
                  {/* Popular Ribbon */}
                  {isPopular && (
                    <div className="absolute top-4 right-4 z-20 bg-aera-accent text-aera-bg px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase shadow-sm">
                      {pkg.badge || "MOST POPULAR"}
                    </div>
                  )}

                  <div className="relative">
                    {/* Package Image */}
                    {pkg.image && (
                      <div className="relative w-full h-48 bg-aera-champagne/10 overflow-hidden">
                        <Image
                          src={normalizeMediaUrl(pkg.image)}
                          alt={pkg.imageAlt || pkg.name}
                          fill
                          className="object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                      </div>
                    )}

                    {/* Content Block */}
                    <div className="p-6 md:p-8">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <h3 className="font-heading text-lg font-normal text-aera-ink group-hover:text-aera-accent transition-colors">
                            {pkg.name}
                          </h3>
                          {pkg.subtitle && (
                            <span className="font-sans text-[10px] text-aera-muted tracking-wider uppercase font-semibold">
                              {pkg.subtitle}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-heading text-xl font-medium text-aera-accent block leading-none">
                            {pkg.priceLabel || `$${pkg.price}`}
                          </span>
                        </div>
                      </div>

                      {/* Duration / Visit Indicators */}
                      <div className="flex gap-4 items-center mb-6 py-2 border-y border-aera-champagne/30 text-[10px] text-aera-muted uppercase tracking-wider font-semibold">
                        {pkg.durationLabel && (
                          <span className="flex items-center gap-1.5">
                            <Clock size={11} className="text-aera-accent" />
                            {pkg.durationLabel}
                          </span>
                        )}
                        {pkg.visitCountLabel && (
                          <span className="flex items-center gap-1.5">
                            <Calendar size={11} className="text-aera-accent" />
                            {pkg.visitCountLabel}
                          </span>
                        )}
                      </div>

                      {pkg.shortDescription && (
                        <p className="font-sans text-xs text-aera-muted mb-6 leading-relaxed">
                          {pkg.shortDescription}
                        </p>
                      )}

                      {/* Features Check list */}
                      <ul className="space-y-3">
                        {pkg.features.map((feat, fIndex) => (
                          <li key={fIndex} className="flex items-start gap-2.5 text-xs text-aera-ink">
                            <div className="w-4 h-4 rounded-full bg-aera-accent/10 text-aera-accent flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={10} className="stroke-[3]" />
                            </div>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="p-6 md:p-8 pt-0 mt-6">
                    <a
                      href="/booking"
                      className="w-full inline-flex items-center justify-center bg-aera-accent hover:bg-aera-accentHover text-white py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 decoration-none shadow-sm cursor-pointer border-none"
                    >
                      Choose Package
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-16 text-aera-muted italic font-sans text-xs">
            No packages found in this category.
          </div>
        )}
      </Container>
    </section>
  );
}

export function FeaturedPackages({ packages }: { packages: NailPackageDTO[] }) {
  return (
    <Suspense fallback={<div className="h-48" />}>
      <PackagesListGrid packages={packages} />
    </Suspense>
  );
}
export default FeaturedPackages;
