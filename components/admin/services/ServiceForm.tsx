"use client";
import React, { useState, useEffect, useMemo } from "react";
import { FormField, FormSelect } from "@/components/common/FormField";
import { ServiceCategoryDTO } from "@/types/services";
import { Plus, Trash2 } from "lucide-react";
import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { asArray } from "@/lib/utils/array";

interface ServiceFormProps {
  categories: ServiceCategoryDTO[];
  initialData?: any;
  onSave: () => void;
  onCancel: () => void;
}

export function ServiceForm({ categories, initialData, onSave, onCancel }: ServiceFormProps) {
  const safeCategories = useMemo(() => asArray<ServiceCategoryDTO>(categories), [categories]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [durationLabel, setDurationLabel] = useState("");
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  
  // Dynamic features list
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setSlug(initialData.slug || "");
      setCategoryId(initialData.categoryId || "");
      setSubcategoryId(initialData.subcategoryId || "");
      setShortDescription(initialData.shortDescription || "");
      setDescription(initialData.description || "");
      setPrice(initialData.price !== undefined && initialData.price !== null ? initialData.price.toString() : "");
      setPriceLabel(initialData.priceLabel || "");
      setDurationMinutes(initialData.durationMinutes !== undefined && initialData.durationMinutes !== null ? initialData.durationMinutes.toString() : "");
      setDurationLabel(initialData.durationLabel || "");
      setImage(initialData.image || "");
      setImageAlt(initialData.imageAlt || "");
      setIsFeatured(!!initialData.isFeatured);
      setIsActive(initialData.isActive !== false);
      setSortOrder(initialData.sortOrder || 0);
      setFeatures(Array.isArray(initialData.features) ? initialData.features : []);
    } else {
      if (safeCategories.length > 0) {
        setCategoryId(safeCategories[0].id);
      }
    }
  }, [initialData, safeCategories]);

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGlobalError("");

    const payload = {
      categoryId: categoryId || null,
      subcategoryId: subcategoryId || null,
      name,
      slug: slug || null,
      shortDescription: shortDescription || null,
      description: description || null,
      price: price !== "" ? Number(price) : null,
      priceLabel: priceLabel || null,
      durationMinutes: durationMinutes !== "" ? Number(durationMinutes) : null,
      durationLabel: durationLabel || null,
      image: image || null,
      imageAlt: imageAlt || null,
      features,
      isFeatured,
      isActive,
      sortOrder: Number(sortOrder),
    };

    try {
      const url = initialData
        ? `/api/admin/services/${initialData.id}`
        : "/api/admin/services";
      
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (json.issues || json.errors) {
          setErrors(json.issues || json.errors);
        } else if (json.error) {
          setGlobalError(json.error);
        } else if (json.message) {
          setGlobalError(json.message);
        } else {
          setGlobalError("Failed to save service");
        }
      } else {
        onSave();
      }
    } catch (error) {
      console.error(error);
      setGlobalError("A connection error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = safeCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));
  const subcategoryOptions = safeCategories
    .find((cat) => cat.id === categoryId)
    ?.subcategories?.map((sub) => ({
      value: sub.id,
      label: sub.name,
    })) || [];

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    const nextCategory = safeCategories.find((cat) => cat.id === value);
    if (!nextCategory?.subcategories?.some((sub) => sub.id === subcategoryId)) {
      setSubcategoryId("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury w-full max-w-4xl font-sans">
      <h2 className="font-heading text-xl font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
        {initialData ? "Edit Service" : "Add New Service"}
      </h2>

      {globalError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 mb-5">
          {globalError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Service Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Classic Manicure"
          error={errors.name?.[0]}
          required
        />

        <FormField
          label="URL Slug (Optional)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g. classic-manicure"
          error={errors.slug?.[0]}
          description="Lowercase alphanumeric with dashes. Generated from name if empty."
        />

        {categoryOptions.length > 0 && (
          <FormSelect
            label="Category"
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            options={categoryOptions}
            error={errors.categoryId?.[0]}
          />
        )}

        {subcategoryOptions.length > 0 && (
          <FormSelect
            label="Subcategory"
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            options={[{ value: "", label: "No Subcategory" }, ...subcategoryOptions]}
            error={errors.subcategoryId?.[0]}
          />
        )}

        <FormField
          label="Sort Order"
          type="number"
          value={sortOrder}
          onChange={(e) => setSortOrder(Number(e.target.value))}
          error={errors.sortOrder?.[0]}
        />
      </div>

      <FormField
        label="Short Description"
        value={shortDescription}
        onChange={(e) => setShortDescription(e.target.value)}
        placeholder="Brief highlight display..."
        error={errors.shortDescription?.[0]}
      />

      <div className="mb-6 font-sans">
        <label className="text-[11px] font-semibold text-[var(--admin-ink)] uppercase tracking-wide block mb-2">
          Full Description
        </label>
        <RichTextEditor
          value={description}
          onChange={(html) => setDescription(html)}
          placeholder="Provide a detailed outline of this nail treatment..."
        />
        {errors.description?.[0] && (
          <p className="mt-1 text-xs text-rose-500">{errors.description[0]}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Price ($)"
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="e.g. 45"
          error={errors.price?.[0]}
        />

        <FormField
          label="Price Label"
          value={priceLabel}
          onChange={(e) => setPriceLabel(e.target.value)}
          placeholder="e.g. $45 or From $15"
          error={errors.priceLabel?.[0]}
          description="Display label overrides raw price representation."
        />

        <FormField
          label="Duration (Minutes)"
          type="number"
          value={durationMinutes}
          onChange={(e) => setDurationMinutes(e.target.value)}
          placeholder="e.g. 45"
          error={errors.durationMinutes?.[0]}
        />

        <FormField
          label="Duration Label"
          value={durationLabel}
          onChange={(e) => setDurationLabel(e.target.value)}
          placeholder="e.g. 45 min or 20 min+"
          error={errors.durationLabel?.[0]}
        />
      </div>

      <div className="mb-6">
        <MediaPickerField
          valueMode="url"
          label="Service Image"
          value={image}
          onChange={(url) => setImage(url || "")}
          alt={imageAlt}
          onAltChange={(altVal) => setImageAlt(altVal)}
          folder="services"
        />
        {errors.image?.[0] && (
          <p className="mt-1 text-xs text-rose-500">{errors.image[0]}</p>
        )}
      </div>

      {/* Feature Tags Editor */}
      <div className="mb-6 font-sans">
        <label className="text-xs font-semibold text-[var(--admin-ink)] tracking-wide block mb-2">
          Features / Key Highlights
        </label>
        
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="Add key service item (e.g. Cuticle care)"
            className="flex-grow rounded-lg border border-[var(--admin-border-strong)] px-3 py-2 text-xs font-sans text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)] bg-white"
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
          />
          <button
            type="button"
            onClick={addFeature}
            className="bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white rounded-lg px-3 py-2 flex items-center justify-center border-none cursor-pointer"
          >
            <Plus size={16} />
          </button>
        </div>

        <ul className="space-y-1.5 pl-0">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center justify-between bg-[var(--admin-surface-muted)] px-3 py-1.5 rounded-lg border border-[var(--admin-border)] text-xs">
              <span className="text-[var(--admin-muted)]">{feature}</span>
              <button
                type="button"
                onClick={() => removeFeature(idx)}
                className="text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer p-1 rounded hover:bg-rose-50"
              >
                <Trash2 size={13} />
              </button>
            </li>
          ))}
          {features.length === 0 && (
            <p className="text-[10px] text-[var(--admin-muted)] italic">No features added yet.</p>
          )}
        </ul>
      </div>

      <div className="flex gap-4 border-t border-[var(--admin-border)]/40 pt-5 mt-5">
        <label className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--admin-border)] accent-[var(--admin-accent)] cursor-pointer"
          />
          <span>Featured Service</span>
        </label>

        <label className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-4 h-4 rounded border-[var(--admin-border)] accent-[var(--admin-accent)] cursor-pointer"
          />
          <span>Active Status</span>
        </label>
      </div>

      <div className="flex justify-end gap-3 mt-8 border-t border-[var(--admin-border)]/40 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="border border-[var(--admin-border)] text-[var(--admin-muted)] hover:bg-[var(--admin-surface-muted)] rounded-full px-5 py-2 text-xs font-semibold cursor-pointer font-sans"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white rounded-full px-6 py-2 text-xs font-semibold cursor-pointer border-none font-sans"
        >
          {loading ? "Saving..." : "Save Service"}
        </button>
      </div>
    </form>
  );
}
export default ServiceForm;
