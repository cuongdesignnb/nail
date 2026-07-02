"use client";
import React, { useState, useEffect } from "react";
import { FormField, FormSelect } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export function ServiceGalleryForm() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [tag, setTag] = useState("Minimal");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const tags = ["Minimal", "Elegant", "Glitter", "Bridal", "Art"];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/service-gallery");
      if (res.ok) {
        const json = await res.json();
        setItems(json.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setImage(item.image || "");
    setImageAlt(item.imageAlt || "");
    setTag(item.tag || "Minimal");
    setSortOrder(item.sortOrder || 0);
    setIsActive(item.isActive !== false);
    setErrors({});
    setGlobalError("");
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setImage("");
    setImageAlt("");
    setTag("Minimal");
    setSortOrder(0);
    setIsActive(true);
    setErrors({});
    setGlobalError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrors({});
    setGlobalError("");

    const payload = {
      title: title || null,
      image,
      imageAlt: imageAlt || null,
      tag,
      sortOrder: Number(sortOrder),
      isActive,
    };

    try {
      const url = editingId ? `/api/admin/service-gallery/${editingId}` : "/api/admin/service-gallery";
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
          setGlobalError(json.message || "Failed to save gallery item");
        }
      } else {
        resetForm();
        fetchItems();
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Connection error occurred. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this gallery item?")) return;
    try {
      const res = await fetch(`/api/admin/service-gallery/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchItems();
      } else {
        alert("Failed to deactivate gallery item");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const tagOptions = tags.map((t) => ({ value: t, label: t }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Gallery list */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury">
        <h3 className="font-heading text-lg font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
          Gallery Items
        </h3>

        {loading ? (
          <p className="text-xs text-aera-muted italic py-4">Loading gallery...</p>
        ) : items.length === 0 ? (
          <p className="text-xs text-aera-muted italic py-4">No gallery items added yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item.id} className="relative group aspect-square bg-aera-champagne/10 rounded-2xl overflow-hidden border border-aera-champagne/40">
                <Image
                  src={item.image}
                  alt={item.title || "Inspiration"}
                  fill
                  className="object-cover"
                />

                {/* Edit overlay */}
                <div className="absolute inset-0 bg-aera-ink/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 flex flex-col justify-between text-white">
                  <div className="flex justify-between items-start">
                    <span className="bg-aera-accent text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {item.tag}
                    </span>
                    <StatusBadge active={item.isActive} activeLabel="A" inactiveLabel="I" />
                  </div>

                  <div>
                    <h5 className="font-heading text-[10px] truncate mb-2">{item.title || "No Title"}</h5>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-white/10 hover:bg-white/20 text-white rounded p-1 cursor-pointer border-none"
                      >
                        <Edit size={11} />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded p-1 cursor-pointer border-none"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Form */}
      <div className="lg:col-span-5">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury">
          <h3 className="font-heading text-base font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
            {editingId ? "Edit Item" : "Add Gallery Item"}
          </h3>

          {globalError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 mb-5">
              {globalError}
            </div>
          )}

          <FormField
            label="Image URL *"
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
              if (!imageAlt) setImageAlt(title || "Nail Art Inspiration");
            }}
            placeholder="e.g. /images/salon-experience-2.jpg"
            error={errors.image?.[0]}
            required
          />

          <FormField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Soft Pink Gold Line"
            error={errors.title?.[0]}
          />

          <FormField
            label="Image Alt Text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="e.g. Soft pink gold line details"
            error={errors.imageAlt?.[0]}
          />

          <FormSelect
            label="Filter Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            options={tagOptions}
            error={errors.tag?.[0]}
          />

          <FormField
            label="Sort Order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            error={errors.sortOrder?.[0]}
          />

          <label className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs mt-2 mb-6">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-aera-champagne accent-aera-accent cursor-pointer"
            />
            <span>Active Status</span>
          </label>

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
              {formLoading ? "Saving..." : editingId ? "Update Item" : "Save Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ServiceGalleryForm;
