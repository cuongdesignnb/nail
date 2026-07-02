"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Plus, Minus } from "lucide-react";
import { PageFaqDTO } from "@/types/packages";

function FAQAccordionItem({ faq }: { faq: PageFaqDTO }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-aera-champagne/30 py-4 text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-2 text-left font-heading text-xs sm:text-sm font-semibold text-aera-ink hover:text-aera-accent transition-colors cursor-pointer border-none bg-transparent"
      >
        <span>{faq.question}</span>
        <span className="text-aera-accent shrink-0 ml-4">
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="font-sans text-[11px] sm:text-xs text-aera-muted pt-2 pb-4 leading-relaxed max-w-3xl">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PackageFAQ({ data }: { data: { title: string; items: PageFaqDTO[] } }) {
  return (
    <section className="bg-aera-bg py-20">
      <Container className="max-w-4xl">
        <SectionHeading eyebrow="FAQ" title={data.title} align="center" />

        <div className="mt-12 space-y-2">
          {data.items.map((faq, idx) => (
            <FAQAccordionItem key={faq.id || idx} faq={faq} />
          ))}
        </div>
      </Container>
    </section>
  );
}
export default PackageFAQ;
