"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";
import { AdminBlogNavTabs } from "@/components/admin/blog/AdminBlogNavTabs";
import { FileText } from "lucide-react";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [post, setPost] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchPost();
    }
  }, [id]);

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

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/blog-posts/${id}`);
      if (res.ok) {
        const json = await res.json();
        setPost(json.data || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
        <h1 className="text-2xl font-bold text-[var(--admin-ink)] flex items-center gap-2 font-heading leading-snug mb-1.5">
          <FileText size={24} className="text-[var(--admin-accent)]" />
          Edit Journal Article
        </h1>
        <p className="text-xs text-[var(--admin-muted)]">
          Modify the article text copy, schedule release schedules, or toggle featured article blocks.
        </p>
      </section>

      <AdminBlogNavTabs />

      <div className="mt-4">
        {loading ? (
          <p className="text-xs text-[var(--admin-muted)] italic py-10 text-center">Loading article details...</p>
        ) : post ? (
          <BlogPostForm
            categories={categories}
            initialData={post}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <p className="text-xs text-rose-600 font-semibold py-10 text-center">Article not found.</p>
        )}
      </div>
    </div>
  );
}
