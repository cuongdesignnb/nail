"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ServiceFaqDTO } from "@/types/services";
import { Plus, Minus } from "lucide-react";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-aera-champagne/60 py-5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="font-heading text-sm md:text-base font-medium text-aera-ink group-hover:text-aera-accent transition-colors duration-300">
          {question}
        </span>
        <div className="w-8 h-8 rounded-full bg-aera-champagne/10 flex items-center justify-center text-aera-muted group-hover:bg-aera-accent/15 group-hover:text-aera-accent transition-all shrink-0 ml-4">
          {isOpen ? <Minus size={14} /> : <Plus size={14} />}
        </div>
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
            <p className="font-sans text-xs text-aera-muted pt-3 pb-2 leading-relaxed max-w-3xl">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ServicesFAQ({ items }: { items: ServiceFaqDTO[] }) {
  return (
    <section className="bg-aera-bg py-20 relative">
      <Container className="max-w-[1000px]">
        <SectionHeading
          eyebrow="COMMON QUESTIONS"
          title="Frequently Asked Questions"
          align="center"
        />

        <div className="bg-aera-champagne/5 rounded-[2rem] p-6 md:p-10 border border-aera-champagne/40">
          {items.map((faq, index) => (
            <FaqItem
              key={faq.id || index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
export default ServicesFAQ;
