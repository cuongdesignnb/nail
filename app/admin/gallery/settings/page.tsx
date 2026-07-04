"use client";
import React, { useState } from "react";
import { AdminGalleryNavTabs } from "@/components/admin/gallery/AdminGalleryNavTabs";
import { GallerySettingsForm } from "@/components/admin/gallery/GallerySettingsForm";
import { GalleryCategoryForm } from "@/components/admin/gallery/GalleryCategoryForm";
import { Settings, FileText, Sparkles } from "lucide-react";
import clsx from "clsx";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("page");

  const subTabs = [
    { id: "page", label: "Page Configurations", icon: FileText },
    { id: "categories", label: "Design Categories", icon: Sparkles },
  ];

  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading leading-snug mb-1.5">
          <Settings size={24} className="text-aera-accent" />
          Gallery Configurations
        </h1>
        <p className="text-xs text-aera-muted">
          Customize page headings, SEO details, contact blocks, and nail art categories.
        </p>
      </section>

      {/* Main tabs */}
      <AdminGalleryNavTabs />

      {/* Sub tabs */}
      <div className="flex border-b border-aera-champagne/45 bg-aera-champagne/5 rounded-2xl p-1 mb-8 max-w-fit mt-4">
        {subTabs.map((st) => {
          const isActive = activeTab === st.id;
          const IconComp = st.icon;
          return (
            <button
              key={st.id}
              onClick={() => setActiveTab(st.id)}
              className={clsx(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer border-none",
                {
                  "bg-white text-aera-accent shadow-sm": isActive,
                  "bg-transparent text-aera-muted hover:text-aera-accent": !isActive,
                }
              )}
            >
              <IconComp size={13} />
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Panels */}
      <div>
        {activeTab === "page" && <GallerySettingsForm />}
        {activeTab === "categories" && <GalleryCategoryForm />}
      </div>
    </div>
  );
}
