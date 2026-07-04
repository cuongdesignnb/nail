"use client";
import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageContentTabs } from "@/components/admin/content-settings/PageContentTabs";
import { PageFaqManager } from "@/components/admin/content-settings/PageFaqManager";
import { PageTestimonialManager } from "@/components/admin/content-settings/PageTestimonialManager";
import { PageContentBlockManager } from "@/components/admin/content-settings/PageContentBlockManager";
import { FileText, ClipboardList, Star, MessageSquare } from "lucide-react";
import clsx from "clsx";

function ContentSettingsPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "faqs";
  const pageKey = searchParams.get("pageKey") || "home";

  const handleTabClick = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/admin/content-settings?${params.toString()}`, { scroll: false });
  };

  const subTabs = [
    { key: "faqs", label: "Page FAQs", icon: MessageSquare },
    { key: "testimonials", label: "Page Reviews", icon: Star },
    { key: "blocks", label: "Content Override Blocks", icon: ClipboardList },
  ];

  const pageLabel = pageKey.charAt(0).toUpperCase() + pageKey.slice(1);

  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading leading-snug mb-1.5">
          <FileText size={24} className="text-aera-accent" />
          Site-Wide Content Hub
        </h1>
        <p className="text-xs text-aera-muted">
          Select a page and switch between sub-tabs to customize FAQs, client reviews, and content block keys.
        </p>
      </section>

      {/* Pages Selector Tabs */}
      <PageContentTabs />

      {/* Sub-tabs segment switcher */}
      <div className="flex border-b border-aera-champagne/45 my-6 overflow-x-auto pb-0.5 scrollbar-hide">
        {subTabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const IconComp = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={clsx(
                "flex items-center gap-2 px-5 py-3 border-b-2 font-sans text-xs font-semibold tracking-wider transition-all whitespace-nowrap bg-transparent cursor-pointer border-none",
                {
                  "border-aera-accent text-aera-accent bg-aera-champagne/5": isActive,
                  "border-transparent text-aera-muted hover:text-aera-accent hover:border-aera-accent/30": !isActive,
                }
              )}
            >
              <IconComp size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Sub-tab manager panel loader */}
      <div className="mt-4">
        {activeTab === "faqs" && <PageFaqManager />}
        {activeTab === "testimonials" && <PageTestimonialManager />}
        {activeTab === "blocks" && <PageContentBlockManager />}
      </div>
    </div>
  );
}

export default function AdminContentSettingsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading site-wide content settings...</div>}>
      <ContentSettingsPanel />
    </Suspense>
  );
}
