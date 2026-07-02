"use client";
import React, { useState, useEffect } from "react";
import { FormSelect } from "@/components/common/FormField";
import { Search, Edit2, Trash2, Copy, Send, Check, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

interface BlogPostTableProps {
  categories: any[];
  refreshTrigger: number;
  onEdit: (post: any) => void;
}

export function BlogPostTable({ categories, refreshTrigger, onEdit }: BlogPostTableProps) {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchPosts();
  }, [search, catFilter, statusFilter, page, refreshTrigger]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        keyword: search,
        categoryId: catFilter,
        status: statusFilter,
        page: page.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/admin/blog-posts?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setList(json.data || []);
        setTotalPages(json.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/admin/blog-posts/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blog-posts/${id}/duplicate`, {
        method: "POST",
      });
      if (res.ok) {
        fetchPosts();
      } else {
        alert("Failed to duplicate post.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishNow = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blog-posts/${id}/publish`, {
        method: "POST",
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectCatOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const selectStatusOptions = [
    { value: "", label: "All Statuses" },
    { value: "DRAFT", label: "Draft" },
    { value: "PUBLISHED", label: "Published" },
    { value: "SCHEDULED", label: "Scheduled" },
    { value: "ARCHIVED", label: "Archived" },
  ];

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-aera-champagne/45 shadow-luxury text-left font-sans">
      {/* Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center mb-6 pb-6 border-b border-aera-champagne/20">
        <div className="md:col-span-6 relative">
          <input
            type="text"
            placeholder="Search articles by title, excerpt..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-aera-champagne/60 pl-9 pr-3 py-2 text-xs font-sans text-aera-ink outline-none focus:border-aera-accent bg-white shadow-sm"
          />
          <Search size={14} className="text-gray-400 absolute left-3 top-[10px]" />
        </div>
        <div className="md:col-span-3">
          <FormSelect
            label=""
            value={catFilter}
            onChange={(e) => {
              setCatFilter(e.target.value);
              setPage(1);
            }}
            options={selectCatOptions}
            className="mb-0"
          />
        </div>
        <div className="md:col-span-3">
          <FormSelect
            label=""
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            options={selectStatusOptions}
            className="mb-0"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-xs text-aera-muted italic py-10 text-center">Loading articles...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[800px]">
            <thead>
              <tr className="border-b border-aera-champagne/20 text-aera-muted">
                <th className="py-3 text-left pl-2">Article</th>
                <th className="py-3 text-left">Category</th>
                <th className="py-3 text-center">Status</th>
                <th className="py-3 text-center">Featured Blocks</th>
                <th className="py-3 text-center">Release Date</th>
                <th className="py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((post) => (
                <tr key={post.id} className="border-b border-aera-champagne/10 hover:bg-aera-cream/10">
                  <td className="py-3 pl-2">
                    <div className="flex items-center gap-3">
                      {post.coverImage && (
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden border bg-aera-champagne/10 shrink-0">
                          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                        </div>
                      )}
                      <div className="max-w-[250px]">
                        <h4 className="font-semibold text-aera-ink truncate hover:text-aera-accent">
                          <Link href={`/blog/${post.slug}`} target="_blank" className="decoration-none text-inherit">
                            {post.title}
                          </Link>
                        </h4>
                        <span className="text-[10px] text-aera-muted block mt-0.5">By {post.authorName || "Aera Team"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-medium text-aera-muted">{post.category?.name || "Uncategorized"}</td>
                  <td className="py-3 text-center">
                    <span className={clsx("px-2 py-0.5 rounded-full text-[9px] font-bold", {
                      "bg-amber-100 text-amber-700": post.status === "DRAFT",
                      "bg-emerald-100 text-emerald-700": post.status === "PUBLISHED",
                      "bg-indigo-100 text-indigo-700": post.status === "SCHEDULED",
                      "bg-gray-100 text-gray-700": post.status === "ARCHIVED",
                    })}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex justify-center gap-1">
                      {post.isFeatured && (
                        <span className="bg-aera-accent/10 text-aera-accent border px-1.5 py-0.5 rounded text-[8px] font-bold">
                          HERO
                        </span>
                      )}
                      {post.isTrending && (
                        <span className="bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded text-[8px] font-bold">
                          TRENDING
                        </span>
                      )}
                      {post.isEditorsPick && (
                        <span className="bg-indigo-50 text-indigo-600 border border-indigo-200 px-1.5 py-0.5 rounded text-[8px] font-bold">
                          PICK
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-center text-aera-muted">
                    {post.status === "SCHEDULED" ? (
                      <span className="text-indigo-600 font-medium">Sched: {formatDate(post.scheduledAt)}</span>
                    ) : (
                      formatDate(post.publishedAt)
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {post.status !== "PUBLISHED" && (
                        <button
                          onClick={() => handlePublishNow(post.id)}
                          title="Publish Now"
                          className="p-1.5 text-emerald-600 hover:text-emerald-700 bg-transparent border-none cursor-pointer"
                        >
                          <Send size={13} />
                        </button>
                      )}
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        title="View Live Post"
                        className="p-1.5 text-gray-500 hover:text-aera-accent inline-flex items-center justify-center"
                      >
                        <ExternalLink size={13} />
                      </Link>
                      <button
                        onClick={() => onEdit(post)}
                        title="Edit Article"
                        className="p-1.5 text-gray-500 hover:text-aera-accent bg-transparent border-none cursor-pointer"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDuplicate(post.id)}
                        title="Duplicate Article"
                        className="p-1.5 text-gray-500 hover:text-indigo-600 bg-transparent border-none cursor-pointer"
                      >
                        <Copy size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        title="Delete Article"
                        className="p-1.5 text-gray-500 hover:text-rose-600 bg-transparent border-none cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-aera-muted italic">
                    No articles found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-6 border-t border-aera-champagne/20 mt-6 text-xs text-aera-muted">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer border-none"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default BlogPostTable;
