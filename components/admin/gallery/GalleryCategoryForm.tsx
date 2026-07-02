"use client";
import React, { useState, useEffect } from "react";
import { FormField } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit, Trash2 } from "lucide-react";

export function GalleryCategoryForm() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery-categories");
      if (res.ok) {
        const json = await res.json();
        setCategories(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setSortOrder(cat.sortOrder || 0);
    setIsActive(cat.isActive !== false);
    setErrors({});
    setGlobalError("");
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
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

    // Auto slugify name if slug is empty
    let finalSlug = slug;
    if (!finalSlug && name) {
      finalSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const payload = {
      name,
      slug: finalSlug,
      description: description || null,
      sortOrder: Number(sortOrder),
      isActive,
    };

    try {
      const url = editingId
        ? `/api/admin/gallery-categories/${editingId}`
        : "/api/admin/gallery-categories";
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
          setGlobalError(json.message || "Failed to save category");
        }
      } else {
        resetForm();
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Connection error occurred. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this category?")) return;
    try {
      const res = await fetch(`/api/admin/gallery-categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchCategories();
      } else {
        alert("Failed to deactivate category");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Category List */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury">
        <h3 className="font-heading text-lg font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
          Gallery Categories
        </h3>

        {loading ? (
          <p className="text-xs text-aera-muted italic py-4">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-xs text-aera-muted italic py-4">No categories added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-aera-ink">
              <thead>
                <tr className="bg-aera-champagne/10 border-b border-aera-champagne/60 text-aera-ink font-semibold">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-aera-champagne/30 hover:bg-aera-champagne/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-aera-ink">{cat.name}</div>
                        {cat.description && (
                          <div className="text-[10px] text-aera-muted mt-0.5">{cat.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-aera-muted">{cat.slug}</td>
                    <td className="px-4 py-3 text-aera-muted">{cat.sortOrder}</td>
                    <td className="px-4 py-3">
                      <StatusBadge active={cat.isActive} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="p-1 text-aera-accent hover:bg-aera-accent/10 rounded border-none bg-transparent cursor-pointer"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
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

      {/* Category Editor Form */}
      <div className="lg:col-span-5">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury"
        >
          <h3 className="font-heading text-base font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
            {editingId ? "Edit Category" : "Create Gallery Category"}
          </h3>

          {globalError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 mb-5">
              {globalError}
            </div>
          )}

          <FormField
            label="Category Name *"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slug) {
                setSlug(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "")
                );
              }
            }}
            placeholder="e.g. Minimal"
            error={errors.name?.[0]}
            required
          />

          <FormField
            label="Category Slug *"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. minimal"
            error={errors.slug?.[0]}
            required
          />

          <FormField
            label="Sort Order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            error={errors.sortOrder?.[0]}
          />

          <FormField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Simple clean nail structures..."
            error={errors.description?.[0]}
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
              {formLoading ? "Saving..." : editingId ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default GalleryCategoryForm;
