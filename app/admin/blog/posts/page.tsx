"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AdminBlogNavTabs } from "@/components/admin/blog/AdminBlogNavTabs";
import { BlogPostTable } from "@/components/admin/blog/BlogPostTable";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";
import { FileText, Plus } from "lucide-react";

function PostsManagerPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const actionParam = searchParams.get("action");

  const [categories, setCategories] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (actionParam === "new") {
      setEditingItem(null);
      setIsEditing(true);
    } else {
      setIsEditing(false);
      setEditingItem(null);
    }
  }, [actionParam]);

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

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("action", "new");
    router.push(`/admin/blog/posts?${params.toString()}`);
  };

  const handleSave = () => {
    setIsEditing(false);
    setEditingItem(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    router.push(`/admin/blog/posts?${params.toString()}`);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingItem(null);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("action");
    router.push(`/admin/blog/posts?${params.toString()}`);
  };

  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading">
            <FileText size={24} className="text-aera-accent" />
            Journal Articles
          </h1>
          <p className="text-xs text-aera-muted mt-1">
            Compose new articles, schedule publications, duplicate templates, and manage draft content.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="bg-aera-accent hover:bg-aera-accentHover text-white text-xs font-semibold px-4 py-2 rounded-full inline-flex items-center gap-1.5 border-none cursor-pointer shadow"
          >
            <Plus size={14} />
            <span>Compose Article</span>
          </button>
        )}
      </section>

      {/* Nav Tabs */}
      <AdminBlogNavTabs />

      {/* Workspace */}
      <div className="mt-4">
        {isEditing ? (
          <BlogPostForm
            categories={categories}
            initialData={editingItem}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <BlogPostTable
            categories={categories}
            refreshTrigger={refreshTrigger}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  );
}

export default function AdminBlogPostsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading articles hub...</div>}>
      <PostsManagerPanel />
    </Suspense>
  );
}
