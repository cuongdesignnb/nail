"use client";
import React, { useState, useEffect } from "react";
import { FormField } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit, Trash2 } from "lucide-react";

export function ServiceAddonForm() {
  const [addons, setAddons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchAddons();
  }, []);

  const fetchAddons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/service-addons");
      if (res.ok) {
        const json = await res.json();
        setAddons(json.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (add: any) => {
    setEditingId(add.id);
    setName(add.name || "");
    setPrice(add.price !== undefined && add.price !== null ? add.price.toString() : "");
    setPriceLabel(add.priceLabel || "");
    setDescription(add.description || "");
    setSortOrder(add.sortOrder || 0);
    setIsActive(add.isActive !== false);
    setErrors({});
    setGlobalError("");
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setPriceLabel("");
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

    const payload = {
      name,
      price: price !== "" ? Number(price) : null,
      priceLabel: priceLabel || null,
      description: description || null,
      sortOrder: Number(sortOrder),
      isActive,
    };

    try {
      const url = editingId ? `/api/admin/service-addons/${editingId}` : "/api/admin/service-addons";
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
          setGlobalError(json.message || "Failed to save Addon");
        }
      } else {
        resetForm();
        fetchAddons();
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Connection error occurred. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this addon?")) return;
    try {
      const res = await fetch(`/api/admin/service-addons/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchAddons();
      } else {
        alert("Failed to deactivate addon");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Addons List */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury">
        <h3 className="font-heading text-lg font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
          Service Add-Ons
        </h3>

        {loading ? (
          <p className="text-xs text-aera-muted italic py-4">Loading addons...</p>
        ) : addons.length === 0 ? (
          <p className="text-xs text-aera-muted italic py-4">No addons added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-aera-ink">
              <thead>
                <tr className="bg-aera-champagne/10 border-b border-aera-champagne/60 text-aera-ink font-semibold">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Price Label</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {addons.map((add) => (
                  <tr key={add.id} className="border-b border-aera-champagne/30 hover:bg-aera-champagne/5 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-aera-ink">{add.name}</div>
                        {add.description && <div className="text-[10px] text-aera-muted mt-0.5">{add.description}</div>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-aera-accent font-medium">{add.priceLabel || `$${add.price}`}</td>
                    <td className="px-4 py-3 text-aera-muted">{add.sortOrder}</td>
                    <td className="px-4 py-3">
                      <StatusBadge active={add.isActive} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEdit(add)}
                          className="p-1 text-aera-accent hover:bg-aera-accent/10 rounded border-none bg-transparent cursor-pointer"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(add.id)}
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

      {/* Editor Form */}
      <div className="lg:col-span-5">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury">
          <h3 className="font-heading text-base font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
            {editingId ? "Edit Addon" : "Create New Addon"}
          </h3>

          {globalError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 mb-5">
              {globalError}
            </div>
          )}

          <FormField
            label="Addon Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. French Tips"
            error={errors.name?.[0]}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Price ($)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 15"
              error={errors.price?.[0]}
            />

            <FormField
              label="Price Label"
              value={priceLabel}
              onChange={(e) => setPriceLabel(e.target.value)}
              placeholder="e.g. $15"
              error={errors.priceLabel?.[0]}
            />
          </div>

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
            placeholder="e.g. Classic white or colored tips"
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
              {formLoading ? "Saving..." : editingId ? "Update Addon" : "Create Addon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default ServiceAddonForm;
