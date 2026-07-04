"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";
import { AdminBlogNavTabs } from "@/components/admin/blog/AdminBlogNavTabs";
import { FileText } from "lucide-react";

export default function NewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/blog-categories");
      if (res.ok) {
        const json = await res.json();
        setCategories(json.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = () => {
    router.push("/admin/blog/posts");
  };

  const handleCancel = () => {
    router.push("/admin/blog/posts");
  };

  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading leading-snug mb-1.5">
          <FileText size={24} className="text-aera-accent" />
          Compose Journal Article
        </h1>
        <p className="text-xs text-aera-muted">
          Draft a new article, select categories, choose graphics, and set schedule times.
        </p>
      </section>

      <AdminBlogNavTabs />

      <div className="mt-4">
        <BlogPostForm
          categories={categories}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
