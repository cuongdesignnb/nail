"use client";

import React from "react";
import { AdminBlogNavTabs } from "@/components/admin/blog/AdminBlogNavTabs";
import { AiContentStudio } from "@/components/admin/ai-content/AiContentStudio";
import { Bot } from "lucide-react";

export default function AdminBlogAiPage() {
  return (
    <div className="admin-page font-sans text-left p-6">
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-[var(--admin-ink)] flex items-center gap-2 font-heading leading-snug mb-1.5">
          <Bot size={24} className="text-[var(--admin-accent)]" />
          AI Content Studio
        </h1>
        <p className="text-xs text-[var(--admin-muted)]">
          Generate SEO-ready blog drafts, queue image creation into Media Library, and manage publishing jobs.
        </p>
      </section>
      <AdminBlogNavTabs />
      <AiContentStudio />
    </div>
  );
}
