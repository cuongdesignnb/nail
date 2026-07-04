"use client";
import React, { useState, useEffect } from "react";
import { FormField, FormTextarea, FormSelect } from "@/components/common/FormField";
import { Plus, Trash2, X, Save } from "lucide-react";
import { PackageCategoryDTO } from "@/types/packages";
import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";

interface NailPackageFormProps {
  categories: PackageCategoryDTO[];
  initialData?: any;
  onSave: () => void;
  onCancel: () => void;
}

export function NailPackageForm({ categories, initialData, onSave, onCancel }: NailPackageFormProps) {
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");

  // Form states
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [price, setPrice] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [durationLabel, setDurationLabel] = useState("");
  const [visitCountLabel, setVisitCountLabel] = useState("");
  const [badge, setBadge] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    if (initialData) {
      setCategoryId(initialData.categoryId || "");
      setName(initialData.name || "");
      setSlug(initialData.slug || "");
      setSubtitle(initialData.subtitle || "");
      setShortDescription(initialData.shortDescription || "");
      setDescription(initialData.description || "");
      setImage(initialData.image || "");
      setImageAlt(initialData.imageAlt || "");
      setPrice(initialData.price !== undefined && initialData.price !== null ? initialData.price.toString() : "");
      setPriceLabel(initialData.priceLabel || "");
      setDurationLabel(initialData.durationLabel || "");
      setVisitCountLabel(initialData.visitCountLabel || "");
      setBadge(initialData.badge || "");
      setFeatures(Array.isArray(initialData.features) ? initialData.features : []);
      setIsPopular(initialData.isPopular ?? false);
      setIsFeatured(initialData.isFeatured ?? true);
      setIsActive(initialData.isActive ?? true);
      setSortOrder(initialData.sortOrder || 0);
    }
  }, [initialData]);

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const removeFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrors({});
    setGlobalError("");

    const payload = {
      categoryId: categoryId || null,
      name,
      slug: slug || undefined,
      subtitle: subtitle || null,
      shortDescription: shortDescription || null,
      description: description || null,
      image: image || null,
      imageAlt: imageAlt || null,
      price: price === "" ? null : Number(price),
      priceLabel: priceLabel || null,
      durationLabel: durationLabel || null,
      visitCountLabel: visitCountLabel || null,
      badge: badge || null,
      features,
      isPopular,
      isFeatured,
      isActive,
      sortOrder: Number(sortOrder),
    };

    try {
      const url = initialData
        ? `/api/admin/nail-packages/${initialData.id}`
        : "/api/admin/nail-packages";
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
          setGlobalError(json.message || "Failed to save package");
        }
      } else {
        onSave();
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Connection error. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  const selectOptions = [
    { value: "", label: "Select Category..." },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  return (
    <div className="p-6 bg-white rounded-xl border border-aera-champagne/20">
      <h3 className="text-sm font-bold text-aera-ink uppercase tracking-wide flex justify-between items-center mb-6">
        {initialData ? "Edit Nail Package" : "Create New Nail Package"}
        <button
          type="button"
          onClick={onCancel}
          className="text-aera-muted hover:text-aera-ink cursor-pointer border-none bg-transparent p-1"
        >
          <X size={16} />
        </button>
      </h3>

      {globalError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-4 mb-6 font-semibold">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormSelect
            label="Package Category tab *"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={selectOptions}
            error={errors.categoryId?.[0]}
          />
          <FormField
            label="Package Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Signature Luxe"
            error={errors.name?.[0]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Slug (Optional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. signature-luxe"
            error={errors.slug?.[0]}
          />
          <FormField
            label="Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Daily Refresh Combo"
            error={errors.subtitle?.[0]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Numeric Price (for sorting/queries)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="95"
            error={errors.price?.[0]}
          />
          <FormField
            label="Display Price Label *"
            value={priceLabel}
            onChange={(e) => setPriceLabel(e.target.value)}
            placeholder="e.g. $95 or From $180 or $159/mo"
            error={errors.priceLabel?.[0]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Duration (Label)"
            value={durationLabel}
            onChange={(e) => setDurationLabel(e.target.value)}
            placeholder="e.g. 75 mins"
            error={errors.durationLabel?.[0]}
          />
          <FormField
            label="Visit Count (Label)"
            value={visitCountLabel}
            onChange={(e) => setVisitCountLabel(e.target.value)}
            placeholder="e.g. 4 Visits"
            error={errors.visitCountLabel?.[0]}
          />
          <FormField
            label="Badge Ribbon (e.g. Popular)"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="MOST POPULAR"
            error={errors.badge?.[0]}
          />
        </div>

        <div className="mb-6">
          <MediaPickerField
            label="Package Image"
            value={image}
            onChange={(url) => setImage(url)}
            alt={imageAlt}
            onAltChange={(altVal) => setImageAlt(altVal)}
            folder="packages"
          />
          {errors.image?.[0] && (
            <p className="mt-1 text-xs text-rose-500">{errors.image[0]}</p>
          )}
        </div>

        <FormTextarea
          label="Short Description"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Brief summary card description..."
          error={errors.shortDescription?.[0]}
          rows={2}
        />

        <div className="mb-6 font-sans">
          <label className="text-[11px] font-semibold text-aera-ink uppercase tracking-wide block mb-2">
            Detailed Description
          </label>
          <RichTextEditor
            value={description}
            onChange={(html) => setDescription(html)}
            placeholder="Complete descriptive layout of the treatment..."
          />
          {errors.description?.[0] && (
            <p className="mt-1 text-xs text-rose-500">{errors.description[0]}</p>
          )}
        </div>

        {/* Dynamic feature checklist list */}
        <div className="border border-aera-champagne/30 rounded-2xl p-4 md:p-6 bg-aera-cream/10">
          <label className="block text-xs font-semibold text-aera-ink tracking-wide mb-3">
            Package Features / inclusions
          </label>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="e.g. Exfoliating sugar scrub"
              className="flex-grow rounded-lg border border-aera-champagne/60 px-3 py-2 text-xs font-sans text-aera-ink outline-none focus:border-aera-accent bg-white"
            />
            <button
              type="button"
              onClick={addFeature}
              className="bg-aera-accent hover:bg-aera-accentHover text-white text-xs px-4 rounded-lg flex items-center gap-1 cursor-pointer border-none"
            >
              <Plus size={14} />
              <span>Add</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {features.map((feat, fIdx) => (
              <span
                key={fIdx}
                className="bg-white border border-aera-champagne/50 px-3 py-1.5 rounded-full text-xs text-aera-ink inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>{feat}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(fIdx)}
                  className="text-gray-400 hover:text-rose-600 bg-transparent border-none cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
            {features.length === 0 && (
              <span className="text-[10px] text-aera-muted italic">No features added yet.</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-aera-champagne/20 pt-4">
          <FormField
            label="Is Popular"
            type="checkbox"
            checked={isPopular}
            onChange={(e: any) => setIsPopular(e.target.checked)}
          />
          <FormField
            label="Is Featured"
            type="checkbox"
            checked={isFeatured}
            onChange={(e: any) => setIsFeatured(e.target.checked)}
          />
          <FormField
            label="Is Active"
            type="checkbox"
            checked={isActive}
            onChange={(e: any) => setIsActive(e.target.checked)}
          />
          <FormField
            label="Sort Order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            error={errors.sortOrder?.[0]}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-aera-champagne/20">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full border-none cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saveLoading}
            className="bg-aera-accent hover:bg-aera-accentHover text-white text-xs font-bold px-6 py-3 rounded-full cursor-pointer border-none shadow-sm flex items-center gap-1.5"
          >
            <Save size={14} />
            <span>{saveLoading ? "Saving package..." : "Save Package"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
export default NailPackageForm;
