"use client";
import React, { useState } from "react";
import { AdminNavTabs } from "@/components/admin/services/AdminNavTabs";
import { ServicesSettingsForm } from "@/components/admin/services/ServicesSettingsForm";
import { ServiceAddonForm } from "@/components/admin/services/ServiceAddonForm";
import { ServiceFaqForm } from "@/components/admin/services/ServiceFaqForm";
import { ServiceGalleryForm } from "@/components/admin/services/ServiceGalleryForm";
import { Settings, FileText, PlusCircle, HelpCircle, Image } from "lucide-react";
import clsx from "clsx";

export default function AdminSettingsPage() {
  const [activeSubTab, setActiveSubTab] = useState("page");

  const subTabs = [
    { id: "page", label: "Page Configurations", icon: FileText },
    { id: "addons", label: "Add-ons", icon: PlusCircle },
    { id: "faqs", label: "FAQs", icon: HelpCircle },
    { id: "gallery", label: "Gallery Items", icon: Image },
  ];

  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Page Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading">
          <Settings size={24} className="text-aera-accent" />
          Services Page Settings
        </h1>
        <p className="text-xs text-aera-muted mt-1">
          Customize page banners, why chooseus facts, CTA layouts, and supplementary sections.
        </p>
      </section>

      {/* Main Admin Tab Sub-Navigation */}
      <AdminNavTabs />

      {/* Local Settings Tab Sub-Navigation */}
      <div className="flex border-b border-aera-champagne/40 bg-aera-champagne/5 rounded-2xl p-1 mb-8 max-w-fit">
        {subTabs.map((st) => {
          const isActive = activeSubTab === st.id;
          const SubIcon = st.icon;
          return (
            <button
              key={st.id}
              onClick={() => setActiveSubTab(st.id)}
              className={clsx(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold font-sans transition-all cursor-pointer border-none",
                {
                  "bg-white text-aera-accent shadow-sm": isActive,
                  "bg-transparent text-aera-muted hover:text-aera-accent": !isActive,
                }
              )}
            >
              <SubIcon size={13} />
              <span>{st.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeSubTab === "page" && <ServicesSettingsForm />}
        {activeSubTab === "addons" && <ServiceAddonForm />}
        {activeSubTab === "faqs" && <ServiceFaqForm />}
        {activeSubTab === "gallery" && <ServiceGalleryForm />}
      </div>
    </div>
  );
}
