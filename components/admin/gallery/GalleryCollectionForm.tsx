"use client";
import React, { useState, useEffect } from "react";
import { FormField } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { AdminConfirmDialog, useToast } from "@/components/admin/ui";

export function GalleryCollectionForm() {
  const toast = useToast();
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [designCount, setDesignCount] = useState(0);
  const [sortOrder, setSortOrder] = useState(0);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Delete state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery-collections");
      if (res.ok) {
        const json = await res.json();
        setCollections(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (col: any) => {
    setEditingId(col.id);
    setTitle(col.title);
    setSlug(col.slug);
    setDescription(col.description || "");
    setImage(col.image || "");
    setImageAlt(col.imageAlt || "");
    setDesignCount(col.designCount || 0);
    setSortOrder(col.sortOrder || 0);
    setIsFeatured(col.isFeatured !== false);
    setIsActive(col.isActive !== false);
    setErrors({});
    setGlobalError("");
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setImage("");
    setImageAlt("");
    setDesignCount(0);
    setSortOrder(0);
    setIsFeatured(true);
    setIsActive(true);
    setErrors({});
    setGlobalError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrors({});
    setGlobalError("");

    let finalSlug = slug;
    if (!finalSlug && title) {
      finalSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const payload = {
      title,
      slug: finalSlug,
      description: description || null,
      image,
      imageAlt: imageAlt || null,
      designCount: Number(designCount),
      sortOrder: Number(sortOrder),
      isFeatured,
      isActive,
    };

    try {
      const url = editingId
        ? `/api/admin/gallery-collections/${editingId}`
        : "/api/admin/gallery-collections";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.errors) {
          setErrors(json.errors);
        } else {
          setGlobalError(json.message || "Failed to save collection");
        }
      } else {
        resetForm();
        fetchCollections();
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Connection error occurred. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`/api/admin/gallery-collections/${deleteTargetId}`, { method: "DELETE" });
      if (res.ok) {
        fetchCollections();
        toast.success("Gallery collection deactivated successfully.");
      } else {
        toast.error("Failed to deactivate collection");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deactivating.");
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Collections List */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury">
        <h3 className="font-heading text-lg font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
          Featured Nail Collections
        </h3>

        {loading ? (
          <p className="text-xs text-[var(--admin-muted)] italic py-4">Loading collections...</p>
        ) : collections.length === 0 ? (
          <p className="text-xs text-[var(--admin-muted)] italic py-4">No collections added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-[var(--admin-ink)]">
              <thead>
                <tr className="border-b border-[var(--admin-border)]/20 text-[var(--admin-muted)]">
                  <th className="py-2 text-left">Preview</th>
                  <th className="py-2 text-left">Title</th>
                  <th className="py-2 text-center">Featured</th>
                  <th className="py-2 text-center">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((col) => (
                  <tr
                    key={col.id}
                    className="border-b border-[var(--admin-border)]/10 hover:bg-[var(--admin-surface-hover)] transition-colors"
                  >
                    <td className="py-3">
                      {col.image ? (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[var(--admin-border)]/45 bg-[var(--admin-surface-hover)]">
                          <Image src={col.image} alt={col.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <span className="text-[10px] text-[var(--admin-muted)] italic">No image</span>
                      )}
                    </td>
                    <td className="py-3 pr-2">
                      <div className="font-semibold text-[var(--admin-ink)]">{col.title}</div>
                      <div className="text-[10px] text-[var(--admin-muted)] mt-0.5 font-mono">{col.slug}</div>
                    </td>
                    <td className="py-3 text-center text-[var(--admin-muted)] font-medium">{col.designCount}</td>
                    <td className="py-3 text-center">
                      <StatusBadge active={col.isActive} />
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEdit(col)}
                          className="p-1.5 hover:bg-[var(--admin-surface-hover)] text-[var(--admin-muted)] hover:text-[var(--admin-accent)] rounded-full border-none bg-transparent cursor-pointer transition-colors"
                          title="Edit"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(col.id)}
                          className="p-1.5 hover:bg-red-50 text-[var(--admin-muted)] hover:text-red-600 rounded-full border-none bg-transparent cursor-pointer transition-colors"
                          title="Deactivate"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Collection Editor Form */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury self-start font-sans">
        <form onSubmit={handleSubmit}>
          <h3 className="font-heading text-lg font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
            {editingId ? "Edit Collection" : "New Collection"}
          </h3>

          {globalError && (
            <div className="bg-red-50 border border-red-150 text-red-700 text-xs rounded-xl p-4 mb-4">
              {globalError}
            </div>
          )}

          <FormField
            label="Collection Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!editingId) {
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "")
                );
              }
            }}
            placeholder="e.g. Wedding Elegance"
            error={errors.title?.[0]}
          />

          <FormField
            label="Collection Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. wedding-elegance"
            error={errors.slug?.[0]}
          />

          <MediaPickerField
            label="Collection Image"
            value={image}
            alt={imageAlt}
            onChange={(url) => setImage(url)}
            onAltChange={(alt) => setImageAlt(alt)}
            folder="gallery"
            required
          />
          {errors.image?.[0] && <p className="mb-4 text-xs text-rose-500">{errors.image[0]}</p>}

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Design Count"
              type="number"
              value={designCount}
              onChange={(e) => setDesignCount(Number(e.target.value))}
              placeholder="0"
              error={errors.designCount?.[0]}
            />

            <FormField
              label="Sort Order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              placeholder="0"
              error={errors.sortOrder?.[0]}
            />
          </div>

          <div className="flex gap-4 mt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs mt-2 mb-6">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--admin-border)] accent-[var(--admin-accent)] cursor-pointer"
              />
              <span>Featured Collection</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs mt-2 mb-6">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--admin-border)] accent-[var(--admin-accent)] cursor-pointer"
              />
              <span>Active Status</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-[var(--admin-border)]/40">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-[var(--admin-border)] text-[var(--admin-muted)] hover:bg-[var(--admin-surface-muted)] rounded-full px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={formLoading}
              className="bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white rounded-full px-5 py-2 text-xs font-semibold cursor-pointer border-none"
            >
              {formLoading ? "Saving..." : editingId ? "Update Collection" : "Create Collection"}
            </button>
          </div>
        </form>
      </div>

      {/* Confirm Deactivate Dialog */}
      <AdminConfirmDialog
        open={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Deactivate Collection"
        description="Are you sure you want to deactivate this gallery collection? This action will hide it from the public site."
        confirmLabel="Deactivate"
        variant="danger"
      />
    </div>
  );
}
export default GalleryCollectionForm;
