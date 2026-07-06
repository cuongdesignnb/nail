"use client";
import React, { useState, useEffect } from "react";
import { FormField, FormSelect } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit, Trash2, Plus, Trash, Sparkles } from "lucide-react";
import { AdminConfirmDialog, useToast } from "@/components/admin/ui";

export function ServicePackageForm() {
  const toast = useToast();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("");
  const [priceLabel, setPriceLabel] = useState("");
  const [badge, setBadge] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/service-packages");
      if (res.ok) {
        const json = await res.json();
        setPackages(json.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg: any) => {
    setEditingId(pkg.id);
    setName(pkg.name || "");
    setSubtitle(pkg.subtitle || "");
    setPrice(pkg.price !== undefined && pkg.price !== null ? pkg.price.toString() : "");
    setPriceLabel(pkg.priceLabel || "");
    setBadge(pkg.badge || "");
    setFeatures(Array.isArray(pkg.features) ? pkg.features : []);
    setIsPopular(!!pkg.isPopular);
    setIsActive(pkg.isActive !== false);
    setSortOrder(pkg.sortOrder || 0);
    setErrors({});
    setGlobalError("");
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setSubtitle("");
    setPrice("");
    setPriceLabel("");
    setBadge("");
    setFeatures([]);
    setNewFeature("");
    setIsPopular(false);
    setIsActive(true);
    setSortOrder(0);
    setErrors({});
    setGlobalError("");
  };

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
    setFormLoading(true);
    setErrors({});
    setGlobalError("");

    const payload = {
      name,
      subtitle: subtitle || null,
      price: price !== "" ? Number(price) : null,
      priceLabel: priceLabel || null,
      badge: badge || null,
      features,
      isPopular,
      isActive,
      sortOrder: Number(sortOrder),
    };

    try {
      const url = editingId
        ? `/api/admin/service-packages/${editingId}`
        : "/api/admin/service-packages";
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
          setGlobalError(json.message || "Failed to save package");
        }
      } else {
        resetForm();
        fetchPackages();
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Connection error occurred. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = (id: string) => setDeleteTarget(id);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/service-packages/${deleteTarget}`, { method: "DELETE" });
      if (res.ok) {
        fetchPackages();
      } else {
        toast.toast({ type: "error", title: "Failed to deactivate package" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      {/* Packages List Panel */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury">
        <h2 className="font-heading text-lg font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
          Service Membership Packages
        </h2>

        {loading ? (
          <p className="text-xs text-[var(--admin-muted)] italic py-4">Loading packages...</p>
        ) : packages.length === 0 ? (
          <div className="text-center py-8 text-[var(--admin-muted)] italic">
            <p className="text-xs">No packages created yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {packages.map((pkg) => (
              <div key={pkg.id} className="p-5 border border-[var(--admin-border)]/40 rounded-2xl bg-[var(--admin-surface-muted)] hover:shadow-luxury hover:bg-white transition-all duration-300 flex justify-between items-start gap-4">
                <div className="text-left">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-heading text-base font-semibold text-[var(--admin-ink)] leading-none">{pkg.name}</h3>
                    {pkg.isPopular && <span className="bg-[var(--admin-accent)] text-white font-sans text-[8px] font-bold py-0.5 px-2 rounded-full">POPULAR</span>}
                    <StatusBadge active={pkg.isActive} />
                  </div>
                  <p className="text-[10px] text-[var(--admin-muted)] mb-2">{pkg.subtitle}</p>
                  <div className="font-heading text-sm font-bold text-[var(--admin-accent)] mb-3">{pkg.priceLabel || `$${pkg.price}`}</div>
                  
                  {/* Features display */}
                  {pkg.features && pkg.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 max-w-lg">
                      {pkg.features.map((feat: string, fIdx: number) => (
                        <span key={fIdx} className="bg-[var(--admin-surface-hover)] text-[9px] text-[var(--admin-muted)] border border-[var(--admin-border)]/40 rounded-full px-2 py-0.5 font-sans">
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(pkg)}
                    className="p-1 text-[var(--admin-accent)] hover:bg-[var(--admin-accent)]/10 rounded border-none bg-transparent cursor-pointer"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(pkg.id)}
                    className="p-1 text-rose-500 hover:bg-rose-50 rounded border-none bg-transparent cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Form Panel */}
      <div className="lg:col-span-5">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury">
          <h3 className="font-heading text-base font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
            {editingId ? "Edit Package" : "Create New Package"}
          </h3>

          {globalError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 mb-5">
              {globalError}
            </div>
          )}

          <FormField
            label="Package Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Signature Luxe"
            error={errors.name?.[0]}
            required
          />

          <FormField
            label="Subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="e.g. Our most loved experience"
            error={errors.subtitle?.[0]}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Price ($)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 95"
              error={errors.price?.[0]}
            />

            <FormField
              label="Price Label"
              value={priceLabel}
              onChange={(e) => setPriceLabel(e.target.value)}
              placeholder="e.g. $95"
              error={errors.priceLabel?.[0]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Badge / Promo Tag"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. Best Seller"
              error={errors.badge?.[0]}
            />

            <FormField
              label="Sort Order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              error={errors.sortOrder?.[0]}
            />
          </div>

          {/* Package Features List */}
          <div className="mb-4 font-sans text-left">
            <label className="text-xs font-semibold text-[var(--admin-ink)] tracking-wide block mb-1">
              Included Services / Features
            </label>
            
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Include service/detail..."
                className="flex-grow rounded-lg border border-[var(--admin-border-strong)] px-3 py-1.5 text-xs font-sans text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)] bg-white"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
              />
              <button
                type="button"
                onClick={addFeature}
                className="bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white rounded-lg px-3 py-1.5 flex items-center justify-center border-none cursor-pointer"
              >
                <Plus size={14} />
              </button>
            </div>

            <ul className="space-y-1 pl-0">
              {features.map((feature, idx) => (
                <li key={idx} className="flex items-center justify-between bg-[var(--admin-surface-muted)] px-2 py-1 rounded border border-[var(--admin-border)]/20 text-xs">
                  <span className="text-[var(--admin-muted)] text-[11px]">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer p-0.5"
                  >
                    <Trash size={12} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4 border-t border-[var(--admin-border)]/40 pt-4 mt-4 mb-6">
            <label className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs">
              <input
                type="checkbox"
                checked={isPopular}
                onChange={(e) => setIsPopular(e.target.checked)}
                className="w-4 h-4 rounded border-[var(--admin-border)] accent-[var(--admin-accent)] cursor-pointer"
              />
              <span>Popular Plan Badge</span>
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
              {formLoading ? "Saving..." : editingId ? "Update Package" : "Create Package"}
            </button>
          </div>
        </form>
      </div>
      <AdminConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Deactivate Package"
        description="Are you sure you want to deactivate this package? This cannot be undone."
        confirmLabel="Deactivate"
        variant="danger"
      />
    </div>
  );
}
export default ServicePackageForm;
