"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Code, AlertTriangle, Check, Copy, FileJson } from "lucide-react";

interface Props {
  value: string;
  onChange: (json: string) => void;
  pageType?: "NailSalon" | "Service" | "Article" | "FAQPage" | "BreadcrumbList";
}

const TEMPLATES: Record<string, object> = {
  NailSalon: {
    "@context": "https://schema.org",
    "@type": "NailSalon",
    name: "Aera Nail Lounge",
    description: "",
    url: "",
    telephone: "",
    address: {
      "@type": "PostalAddress",
      streetAddress: "",
      addressLocality: "",
      addressRegion: "",
      postalCode: "",
      addressCountry: "US",
    },
    openingHoursSpecification: [],
    priceRange: "$$",
    image: "",
  },
  Service: {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "",
    description: "",
    provider: { "@type": "NailSalon", name: "Aera Nail Lounge" },
    areaServed: "",
    offers: {
      "@type": "Offer",
      price: "",
      priceCurrency: "USD",
    },
  },
  Article: {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "",
    description: "",
    author: { "@type": "Organization", name: "Aera Nail Lounge" },
    datePublished: "",
    dateModified: "",
    image: "",
  },
  FAQPage: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "",
        acceptedAnswer: { "@type": "Answer", text: "" },
      },
    ],
  },
  BreadcrumbList: {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "", item: "" },
    ],
  },
};

export default function SeoSchemaEditor({ value, onChange, pageType }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const validate = useCallback(
    (json: string) => {
      if (!json.trim()) {
        setError(null);
        return;
      }
      try {
        JSON.parse(json);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Invalid JSON");
      }
    },
    []
  );

  const applyTemplate = (type: string) => {
    const tmpl = TEMPLATES[type];
    if (tmpl) {
      const json = JSON.stringify(tmpl, null, 2);
      onChange(json);
      setError(null);
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch {
      // keep as is
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <label
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#2f1c11",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <FileJson size={15} />
          Structured Data (JSON-LD)
        </label>
        <div style={{ display: "flex", gap: 6 }}>
          {Object.keys(TEMPLATES).map((key) => (
            <button
              key={key}
              onClick={() => applyTemplate(key)}
              style={{
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 600,
                background:
                  pageType === key
                    ? "rgba(168, 93, 30, 0.1)"
                    : "rgba(116, 55, 15, 0.04)",
                border: "1px solid rgba(116, 55, 15, 0.1)",
                borderRadius: 6,
                color: pageType === key ? "#a85d1e" : "#7f6d61",
                cursor: "pointer",
              }}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <textarea
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            validate(e.target.value);
          }}
          onBlur={() => validate(value)}
          placeholder='{\n  "@context": "https://schema.org",\n  "@type": "NailSalon"\n}'
          style={{
            width: "100%",
            minHeight: 200,
            padding: 14,
            fontFamily: "monospace",
            fontSize: 12,
            lineHeight: 1.6,
            background: "#faf7f3",
            border: `1px solid ${error ? "rgba(220, 38, 38, 0.3)" : "rgba(116, 55, 15, 0.12)"}`,
            borderRadius: 12,
            color: "#2f1c11",
            resize: "vertical",
            outline: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            display: "flex",
            gap: 4,
          }}
        >
          <button
            onClick={formatJson}
            style={miniBtn}
            title="Format JSON"
          >
            <Code size={13} />
          </button>
          <button
            onClick={copyToClipboard}
            style={miniBtn}
            title="Copy"
          >
            {copied ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 6,
            fontSize: 12,
            color: "#dc2626",
          }}
        >
          <AlertTriangle size={13} />
          {error}
        </motion.div>
      )}

      {!error && value.trim() && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 6,
            fontSize: 12,
            color: "#16a34a",
          }}
        >
          <Check size={13} />
          Valid JSON-LD
        </div>
      )}
    </div>
  );
}

const miniBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 28,
  height: 28,
  borderRadius: 6,
  background: "rgba(255, 253, 249, 0.9)",
  border: "1px solid rgba(116, 55, 15, 0.1)",
  color: "#7f6d61",
  cursor: "pointer",
};
