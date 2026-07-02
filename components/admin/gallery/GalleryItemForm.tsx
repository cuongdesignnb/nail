"use client";
import React, { useState, useEffect } from "react";
import { FormField, FormSelect, FormTextarea } from "@/components/common/FormField";
import { GalleryCategoryDTO } from "@/types/gallery";

interface GalleryItemFormProps {
  categories: GalleryCategoryDTO[];
  initialData?: any | null;
  onSave: () => void;
  onCancel: () => void;
}

export function GalleryItemForm({ categories, initialData, onSave, onCancel }: GalleryItemFormProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [tag, setTag] = useState("Minimal");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isHighlight, setIsHighlight] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);

  const tags = ["Minimal", "Elegant", "Glitter", "Bridal", "Floral", "French Tips", "Art"];

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setSlug(initialData.slug || "");
      setCategoryId(initialData.categoryId || "");
      setImage(initialData.image || "");
      setImageAlt(initialData.imageAlt || "");
      setTag(initialData.tag || "Minimal");
      setDescription(initialData.description || "");
      setSortOrder(initialData.sortOrder || 0);
      setIsHighlight(initialData.isHighlight === true);
      setIsActive(initialData.isActive !== false);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      categoryId: categoryId || null,
      title,
      slug: finalSlug,
      image,
      imageAlt: imageAlt || null,
      tag,
      description: description || null,
      sortOrder: Number(sortOrder),
      isHighlight,
      isActive,
    };

    try {
      const url = initialData
        ? `/api/admin/gallery-items/${initialData.id}`
        : "/api/admin/gallery-items";
      const method = initialData ? "PUT" : "POST";

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
          setGlobalError(json.message || "Failed to save gallery design item");
        }
      } else {
        onSave();
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: "", label: "Select Category (Optional)" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const tagOptions = tags.map((t) => ({ value: t, label: t }));

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury text-left font-sans"
    >
      <h3 className="font-heading text-lg font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
        {initialData ? "Edit Nail Design Item" : "Create Nail Design Item"}
      </h3>

      {globalError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-4 mb-5">
          {globalError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side */}
        <div className="space-y-4">
          <FormField
            label="Design Title *"
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
            placeholder="e.g. Chrome Shine Almond"
            error={errors.title?.[0]}
            required
          />

          <FormField
            label="Design Slug *"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. chrome-shine-almond"
            error={errors.slug?.[0]}
            required
          />

          <FormSelect
            label="Associated Category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={categoryOptions}
            error={errors.categoryId?.[0]}
          />

          <FormSelect
            label="Filter Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            options={tagOptions}
            error={errors.tag?.[0]}
          />
        </div>

        {/* Right Side */}
        <div className="space-y-4">
          <FormField
            label="Image URL / Path *"
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
              if (!imageAlt) setImageAlt(title || "Nail design");
            }}
            placeholder="e.g. /images/gallery-item-1.jpg"
            error={errors.image?.[0]}
            required
          />

          <FormField
            label="Image Alt Text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="e.g. Chrome shiny almond manicure detail"
            error={errors.imageAlt?.[0]}
          />

          <FormField
            label="Sort Order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            error={errors.sortOrder?.[0]}
          />

          <div className="flex flex-col gap-2 mt-4">
            <label className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs">
              <input
                type="checkbox"
                checked={isHighlight}
                onChange={(e) => setIsHighlight(e.target.checked)}
                className="w-4 h-4 rounded border-aera-champagne accent-aera-accent cursor-pointer"
              />
              <span>Is Highlight (displays as double-sized tile in mosaic grid)</span>
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
        </div>
      </div>

      <div className="mt-4">
        <FormTextarea
          label="Description / Details"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Design style, colors, accessories details..."
          error={errors.description?.[0]}
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-aera-champagne/40">
        <button
          type="button"
          onClick={onCancel}
          className="border border-aera-champagne text-aera-muted hover:bg-aera-champagne/10 rounded-full px-5 py-2 text-xs font-semibold cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-aera-accent hover:bg-aera-accentHover text-white rounded-full px-6 py-2 text-xs font-semibold cursor-pointer border-none"
        >
          {loading ? "Saving..." : "Save Design"}
        </button>
      </div>
    </form>
  );
}
export default GalleryItemForm;
