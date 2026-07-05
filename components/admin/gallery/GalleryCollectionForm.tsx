"use client";
import React, { useState, useEffect } from "react";
import { FormField } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit, Trash2, Star } from "lucide-react";
import Image from "next/image";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";

export function GalleryCollectionForm() {
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
    setImage(col.image);
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this collection?")) return;
    try {
      const res = await fetch(`/api/admin/gallery-collections/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCollections();
      } else {
        alert("Failed to deactivate collection");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Collections List */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury">
        <h3 className="font-heading text-lg font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
          Featured Nail Collections
        </h3>

        {loading ? (
          <p className="text-xs text-aera-muted italic py-4">Loading collections...</p>
        ) : collections.length === 0 ? (
          <p className="text-xs text-aera-muted italic py-4">No collections added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-aera-ink">
              <thead>
                <tr className="bg-aera-champagne/10 border-b border-aera-champagne/60 text-aera-ink font-semibold">
                  <th className="px-4 py-3">Thumbnail</th>
                  <th className="px-4 py-3">Title / Details</th>
                  <th className="px-4 py-3">Designs</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((col) => (
                  <tr
                    key={col.id}
                    className="border-b border-aera-champagne/30 hover:bg-aera-champagne/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-aera-champagne/15 border border-aera-champagne/30">
                        <Image src={col.image} alt={col.title} fill className="object-cover" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-aera-ink flex items-center gap-1.5">
                          {col.title}
                          {col.isFeatured && (
                            <Star size={11} className="fill-aera-gold text-aera-gold" />
                          )}
                        </div>
                        <div className="text-[10px] text-aera-muted mt-0.5">{col.slug}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-aera-muted font-medium">{col.designCount}</td>
                    <td className="px-4 py-3">
                      <StatusBadge active={col.isActive} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEdit(col)}
                          className="p-1 text-aera-accent hover:bg-aera-accent/10 rounded border-none bg-transparent cursor-pointer"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(col.id)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded border-none bg-transparent cursor-pointer"
                        >
                          <Trash2 size={14} />
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
      <div className="lg:col-span-5">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury"
        >
          <h3 className="font-heading text-base font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
            {editingId ? "Edit Collection" : "Create Nail Collection"}
          </h3>

          {globalError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 mb-5">
              {globalError}
            </div>
          )}

          <FormField
            label="Collection Title *"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slug) {
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "")
                );
              }
            }}
            placeholder="e.g. Minimal Nude"
            error={errors.title?.[0]}
            required
          />

          <FormField
            label="Collection Slug *"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. minimal-nude"
            error={errors.slug?.[0]}
            required
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
              error={errors.designCount?.[0]}
            />

            <FormField
              label="Sort Order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              error={errors.sortOrder?.[0]}
            />
          </div>

          <div className="flex flex-col gap-2 mt-2 mb-6">
            <label className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-aera-champagne accent-aera-accent cursor-pointer"
              />
              <span>Featured status (show star badge)</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-aera-champagne accent-aera-accent cursor-pointer"
              />
              <span>Active Status</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-aera-champagne/40">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-aera-champagne text-aera-muted hover:bg-aera-champagne/10 rounded-full px-4 py-2 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={formLoading}
              className="bg-aera-accent hover:bg-aera-accentHover text-white rounded-full px-5 py-2 text-xs font-semibold cursor-pointer border-none"
            >
              {formLoading ? "Saving..." : editingId ? "Update Collection" : "Create Collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default GalleryCollectionForm;
