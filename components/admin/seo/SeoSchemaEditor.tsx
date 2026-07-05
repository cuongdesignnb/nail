"use client";

import React from "react";
import { AlertTriangle, BriefcaseBusiness, ChevronDown, Code2, HelpCircle, ListTree, Newspaper, Search, Sparkles } from "lucide-react";

interface Props {
  value: string;
  onChange: (json: string) => void;
}

const tabs = [
  ["local", "Local Business Schema", BriefcaseBusiness],
  ["website", "Website Schema", Search],
  ["breadcrumbs", "Breadcrumb Schema", ListTree],
  ["faq", "FAQ Schema", HelpCircle],
  ["article", "Blog Article Schema", Newspaper],
  ["service", "Service Schema", Sparkles],
  ["advanced", "Advanced Legacy Schema", Code2],
] as const;

export default function SeoSchemaEditor({ value, onChange }: Props) {
  const [active, setActive] = React.useState<(typeof tabs)[number][0]>("local");
  const [expanded, setExpanded] = React.useState(false);
  const [error, setError] = React.useState("");

  function validate(json: string) {
    if (!json.trim()) {
      setError("");
      return;
    }
    try {
      const parsed = JSON.parse(json);
      const serialized = JSON.stringify(parsed);
      if (/<script|javascript:|data:|vbscript:/i.test(serialized)) {
        setError("Unsafe script or URL content is not allowed.");
      } else {
        setError("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid JSON");
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-aera-ink">Structured Data Builder</h3>
        <p className="mt-1 text-xs text-aera-muted">Schema is generated from approved settings and public content. Use Global Content for business identity, contact, logo, social links, and default share image.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {tabs.map(([key, label, Icon]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              active === key ? "border-aera-accent bg-aera-accent text-white" : "border-aera-champagne text-aera-ink"
            }`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>
      {active !== "advanced" ? (
        <div className="rounded-xl border border-aera-champagne/40 bg-aera-champagne/10 p-4 text-xs text-aera-muted">
          <div className="font-bold text-aera-ink">Source Mapping</div>
          <div className="mt-2 grid gap-1 md:grid-cols-2">
            <span>Business Name: Global Content - Brand Identity</span>
            <span>Phone: Global Content - Default Contact</span>
            <span>Address: Global Content - Default Contact</span>
            <span>Logo: Global Content - Brand Logo</span>
            <span>Social Profiles: Global Content - Social Links</span>
            <span>Default Image: Global Content - Default Share Image</span>
          </div>
          <a className="mt-3 inline-flex font-bold text-aera-accent hover:underline" href="/admin/content/global">Open Global Content Settings</a>
        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <button type="button" onClick={() => setExpanded((next) => !next)} className="flex w-full items-center justify-between text-left text-sm font-bold text-aera-ink">
            Advanced schema is intended for technical use only.
            <ChevronDown size={16} />
          </button>
          {expanded && (
            <div className="mt-3">
              <textarea
                value={value}
                onChange={(e) => {
                  onChange(e.target.value);
                  validate(e.target.value);
                }}
                className="min-h-48 w-full rounded-lg border border-amber-200 bg-white p-3 font-mono text-xs text-aera-ink outline-none"
                placeholder='{"@context":"https://schema.org","@type":"Service"}'
              />
              {error && <p className="mt-2 flex items-center gap-2 text-xs text-red-600"><AlertTriangle size={13} /> {error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

