"use client";
import React, { useState, useEffect } from "react";
import { FormField, FormTextarea } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Save } from "lucide-react";
import { MediaPickerModal } from "./MediaPickerModal";
import Image from "next/image";

export function BlogCategoryForm() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");

  // Media library picker target
  const [showPicker, setShowPicker] = useState(false);

  // Editor states
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [icon, setIcon] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog-categories");
      if (res.ok) {
        const json = await res.json();
        setList(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: any) => {
    setEditId(cat.id);
    setName(cat.name || "");
    setSlug(cat.slug || "");
    setDescription(cat.description || "");
    setImage(cat.image || "");
    setImageAlt(cat.imageAlt || "");
    setIcon(cat.icon || "");
    setSortOrder(cat.sortOrder || 0);
    setIsActive(cat.isActive ?? true);
    setErrors({});
    setGlobalError("");
  };

  const handleCancel = () => {
    setEditId(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("");
    setImageAlt("");
    setIcon("");
    setSortOrder(0);
    setIsActive(true);
    setErrors({});
    setGlobalError("");
  };

  const handleMediaSelect = (url: string, alt: string) => {
    setImage(url);
    setImageAlt(alt || name);
    setShowPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrors({});
    setGlobalError("");

    const payload = {
      name,
      slug: slug || undefined,
      description: description || null,
      image: image || null,
      imageAlt: imageAlt || null,
      icon: icon || null,
      sortOrder: Number(sortOrder),
      isActive,
    };

    try {
      const url = editId
        ? `/api/admin/blog-categories/${editId}`
        : "/api/admin/blog-categories";
      const method = editId ? "PUT" : "POST";

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
          setGlobalError(json.message || "Operation failed");
        }
      } else {
        handleCancel();
        fetchList();
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Connection issue.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/blog-categories/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok) {
        fetchList();
      } else {
        alert(json.message || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left font-sans">
      {/* Categories table list side */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-aera-champagne/45 shadow-luxury">
        <h3 className="font-heading text-base font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
          Available Categories
        </h3>

        {loading ? (
          <p className="text-xs text-aera-muted italic py-6 text-center">Loading categories list...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-aera-champagne/20 text-aera-muted">
                  <th className="py-3 text-left">Category</th>
                  <th className="py-3 text-center">Order</th>
                  <th className="py-3 text-center">Posts Count</th>
                  <th className="py-3 text-center">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((cat) => (
                  <tr key={cat.id} className="border-b border-aera-champagne/10 hover:bg-aera-cream/10">
                    <td className="py-3 font-semibold text-aera-ink">
                      <div className="flex items-center gap-3">
                        {cat.image && (
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden border">
                            <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                          </div>
                        )}
                        <div>
                          <p>{cat.name}</p>
                          <span className="text-[9px] text-aera-muted">slug: {cat.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-center">{cat.sortOrder}</td>
                    <td className="py-3 text-center font-bold text-aera-accent">{cat.postCount ?? 0}</td>
                    <td className="py-3 text-center">
                      <StatusBadge active={cat.isActive} />
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-1.5 text-gray-500 hover:text-aera-accent bg-transparent border-none cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 text-gray-500 hover:text-rose-600 bg-transparent border-none cursor-pointer"
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

      {/* Categories editor form side */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-aera-champagne/45 shadow-luxury self-start">
        <h3 className="font-heading text-base font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3 flex justify-between items-center">
          <span>{editId ? "Edit Category" : "Add New Category"}</span>
          {editId && (
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
              <X size={15} />
            </button>
          )}
        </h3>

        {globalError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-4 mb-4 font-semibold">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Category Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Wellness"
            error={errors.name?.[0]}
          />
          
          <FormField
            label="Category URL Slug (Optional)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Auto-generated if empty"
            error={errors.slug?.[0]}
          />

          <FormTextarea
            label="Category Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Summarize the topics..."
            error={errors.description?.[0]}
            rows={2}
          />

          {/* Category Image Picker */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-aera-ink uppercase tracking-wider">Category Cover Image</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                placeholder="No image chosen"
                value={image}
                className="flex-grow rounded-xl border border-aera-champagne/60 px-3 py-2 text-xs outline-none bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="bg-aera-cream hover:bg-aera-champagne/30 text-aera-accent border border-aera-champagne px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon size={13} />
                <span>Browse</span>
              </button>
            </div>
            {image && (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border">
                <Image src={image} alt="Preview" fill className="object-cover" />
              </div>
            )}
            <FormField
              label="Cover Image Alt"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Visual description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Sort Order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              error={errors.sortOrder?.[0]}
            />
            <div className="pt-6">
              <FormField
                label="Is Active"
                type="checkbox"
                checked={isActive}
                onChange={(e: any) => setIsActive(e.target.checked)}
                error={errors.isActive?.[0]}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full border-none cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={saveLoading}
              className="bg-aera-accent hover:bg-aera-accentHover text-white text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer border-none shadow-sm flex items-center gap-1.5"
            >
              {editId ? <Save size={13} /> : <Plus size={13} />}
              <span>{saveLoading ? "Saving..." : editId ? "Save Category" : "Create Category"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Media Library dialog */}
      {showPicker && (
        <MediaPickerModal
          onSelect={handleMediaSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
export default BlogCategoryForm;
