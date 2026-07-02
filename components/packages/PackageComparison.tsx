"use client";
import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Check, Minus } from "lucide-react";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { PackagesPageContent } from "@/types/packages";

export function PackageComparison({ data }: { data: PackagesPageContent["comparison"] }) {
  const renderCell = (val?: string) => {
    if (!val || val === "-") {
      return <Minus size={14} className="text-gray-300 mx-auto" />;
    }
    if (val.toLowerCase() === "check") {
      return (
        <div className="w-5 h-5 rounded-full bg-aera-accent/10 text-aera-accent flex items-center justify-center mx-auto shadow-sm">
          <Check size={12} className="stroke-[3]" />
        </div>
      );
    }
    return <span className="font-heading text-xs font-semibold text-aera-accent">{val}</span>;
  };

  return (
    <section className="bg-aera-bg py-20">
      <Container>
        <SectionHeading
          eyebrow="TRANSPARENT VALUE"
          title={data.title}
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-12 overflow-x-auto rounded-3xl border border-aera-champagne/40 shadow-luxury bg-white scrollbar-hide"
        >
          <table className="w-full border-collapse min-w-[700px] text-left">
            <thead>
              <tr className="border-b border-aera-champagne/20 bg-aera-cream/35">
                <th className="p-6 font-sans text-xs font-bold tracking-wider text-aera-muted uppercase w-1/3">
                  Features
                </th>
                {data.columns.map((col, idx) => (
                  <th
                    key={idx}
                    className="p-6 text-center font-sans text-xs font-bold tracking-wider text-aera-ink uppercase border-l border-aera-champagne/15"
                  >
                    <div className="block">{col.label}</div>
                    <span className="block text-[11px] text-aera-accent font-medium normal-case mt-1">
                      {col.priceLabel}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.features.map((feature, fIdx) => (
                <motion.tr
                  key={feature.id || fIdx}
                  variants={fadeUp}
                  className="border-b border-aera-champagne/10 hover:bg-aera-cream/10 transition-colors"
                >
                  <td className="p-5 font-heading text-xs text-aera-ink font-semibold">
                    {feature.featureName}
                  </td>
                  {data.columns.map((col, cIdx) => {
                    const cellVal = feature[col.key];
                    return (
                      <td
                        key={cIdx}
                        className="p-5 text-center border-l border-aera-champagne/10"
                      >
                        {renderCell(cellVal)}
                      </td>
                    );
                  })}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </Container>
    </section>
  );
}
export default PackageComparison;
