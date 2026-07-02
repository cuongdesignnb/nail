"use client";
import React, { useState, useEffect } from "react";
import { FormField, FormTextarea } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";

export function PackageOccasionForm() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");

  // Editor states
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
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
      const res = await fetch("/api/admin/package-occasions");
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

  const handleEdit = (occ: any) => {
    setEditId(occ.id);
    setTitle(occ.title || "");
    setDescription(occ.description || "");
    setImage(occ.image || "");
    setImageAlt(occ.imageAlt || "");
    setIcon(occ.icon || "");
    setSortOrder(occ.sortOrder || 0);
    setIsActive(occ.isActive ?? true);
    setErrors({});
    setGlobalError("");
  };

  const handleCancel = () => {
    setEditId(null);
    setTitle("");
    setDescription("");
    setImage("");
    setImageAlt("");
    setIcon("");
    setSortOrder(0);
    setIsActive(true);
    setErrors({});
    setGlobalError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrors({});
    setGlobalError("");

    const payload = {
      title,
      description,
      image: image || null,
      imageAlt: imageAlt || null,
      icon: icon || null,
      sortOrder: Number(sortOrder),
      isActive,
    };

    try {
      const url = editId
        ? `/api/admin/package-occasions/${editId}`
        : "/api/admin/package-occasions";
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
      setGlobalError("Connection error.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this occasion?")) return;
    try {
      const res = await fetch(`/api/admin/package-occasions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchList();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left font-sans">
      {/* List side */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-aera-champagne/45 shadow-luxury">
        <h3 className="font-heading text-base font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
          Occasion Cards
        </h3>

        {loading ? (
          <p className="text-xs text-aera-muted italic py-6 text-center">Loading list...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-aera-champagne/20 text-aera-muted">
                  <th className="py-3 text-left">Title</th>
                  <th className="py-3 text-left">Description</th>
                  <th className="py-3 text-center">Icon</th>
                  <th className="py-3 text-center">Order</th>
                  <th className="py-3 text-center">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((occ) => (
                  <tr key={occ.id} className="border-b border-aera-champagne/10 hover:bg-aera-cream/10">
                    <td className="py-3 font-semibold text-aera-ink">{occ.title}</td>
                    <td className="py-3 text-aera-muted max-w-[200px] truncate">{occ.description}</td>
                    <td className="py-3 text-center font-medium text-aera-accent">{occ.icon || "sparkles"}</td>
                    <td className="py-3 text-center">{occ.sortOrder}</td>
                    <td className="py-3 text-center">
                      <StatusBadge active={occ.isActive} />
                    </td>
                    <td className="py-3 text-right font-semibold">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEdit(occ)}
                          className="p-1.5 text-gray-500 hover:text-aera-accent bg-transparent border-none cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(occ.id)}
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

      {/* Editor Form side */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-aera-champagne/45 shadow-luxury self-start">
        <h3 className="font-heading text-base font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3 flex justify-between items-center">
          <span>{editId ? "Edit Occasion" : "Add Occasion"}</span>
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
            label="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Bridal Prep"
            error={errors.title?.[0]}
          />
          <FormTextarea
            label="Description *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Occasion description..."
            error={errors.description?.[0]}
            rows={2}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Lucide Icon"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g. gem, sparkles, heart, gift"
              error={errors.icon?.[0]}
            />
            <FormField
              label="Image Path"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/images/occasion-bridal.jpg"
              error={errors.image?.[0]}
            />
          </div>
          <FormField
            label="Image Alt Text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            placeholder="Wedding bridal prep details"
            error={errors.imageAlt?.[0]}
          />
          <div className="grid grid-cols-2 gap-4 border-t border-aera-champagne/20 pt-4 mt-4">
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
              <span>{saveLoading ? "Saving..." : editId ? "Save Occasion" : "Create"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default PackageOccasionForm;
