"use client";
import React, { useState, useEffect } from "react";
import { FormField } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/ui";

export function PackageComparisonForm() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");

  // Editor states
  const [editId, setEditId] = useState<string | null>(null);
  const [featureName, setFeatureName] = useState("");
  const [essentialValue, setEssentialValue] = useState("");
  const [signatureValue, setSignatureValue] = useState("");
  const [premiumValue, setPremiumValue] = useState("");
  const [vipValue, setVipValue] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/package-comparison-features");
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

  const handleEdit = (feat: any) => {
    setEditId(feat.id);
    setFeatureName(feat.featureName || "");
    setEssentialValue(feat.essentialValue || "");
    setSignatureValue(feat.signatureValue || "");
    setPremiumValue(feat.premiumValue || "");
    setVipValue(feat.vipValue || "");
    setSortOrder(feat.sortOrder || 0);
    setIsActive(feat.isActive ?? true);
    setErrors({});
    setGlobalError("");
  };

  const handleCancel = () => {
    setEditId(null);
    setFeatureName("");
    setEssentialValue("");
    setSignatureValue("");
    setPremiumValue("");
    setVipValue("");
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
      featureName,
      essentialValue: essentialValue || null,
      signatureValue: signatureValue || null,
      premiumValue: premiumValue || null,
      vipValue: vipValue || null,
      sortOrder: Number(sortOrder),
      isActive,
    };

    try {
      const url = editId
        ? `/api/admin/package-comparison-features/${editId}`
        : "/api/admin/package-comparison-features";
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

  const handleDeleteClick = (id: string) => setDeleteTarget(id);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/package-comparison-features/${deleteTarget}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchList();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left font-sans">
      {/* List side */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[var(--admin-border)]/45 shadow-luxury">
        <h3 className="font-heading text-base font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
          Comparison Table Rows
        </h3>

        {loading ? (
          <p className="text-xs text-[var(--admin-muted)] italic py-6 text-center">Loading rows...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-[var(--admin-border)]/20 text-[var(--admin-muted)]">
                  <th className="py-3 text-left">Feature</th>
                  <th className="py-3 text-center">Essential</th>
                  <th className="py-3 text-center">Signature</th>
                  <th className="py-3 text-center">Premium</th>
                  <th className="py-3 text-center">VIP</th>
                  <th className="py-3 text-center">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.id} className="border-b border-[var(--admin-border)]/10 hover:bg-[var(--admin-surface-muted)]">
                    <td className="py-3 font-semibold text-[var(--admin-ink)]">{item.featureName}</td>
                    <td className="py-3 text-center font-medium text-[var(--admin-accent)]">{item.essentialValue || "-"}</td>
                    <td className="py-3 text-center font-medium text-[var(--admin-accent)]">{item.signatureValue || "-"}</td>
                    <td className="py-3 text-center font-medium text-[var(--admin-accent)]">{item.premiumValue || "-"}</td>
                    <td className="py-3 text-center font-medium text-[var(--admin-accent)]">{item.vipValue || "-"}</td>
                    <td className="py-3 text-center">
                      <StatusBadge active={item.isActive} />
                    </td>
                    <td className="py-3 text-right font-semibold">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 text-gray-500 hover:text-[var(--admin-accent)] bg-transparent border-none cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id)}
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
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[var(--admin-border)]/45 shadow-luxury self-start">
        <h3 className="font-heading text-base font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3 flex justify-between items-center">
          <span>{editId ? "Edit Comparison Feature" : "Add Comparison Row"}</span>
          {editId && (
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
              <X size={15} />
            </button>
          )}
        </h3>

        {/* Tip box */}
        <div className="bg-[var(--admin-surface-muted)] border border-[var(--admin-border)] text-[var(--admin-muted)] rounded-2xl p-4 mb-4 text-[10px] leading-relaxed">
          <strong className="text-[var(--admin-accent)] block mb-1">Formatting Guidelines:</strong>
          - Type <code className="bg-white border px-1 py-0.5 rounded">check</code> to display a checkmark icon.<br />
          - Type <code className="bg-white border px-1 py-0.5 rounded">-</code> to display a dash divider.<br />
          - Type any text (e.g. <code className="bg-white border px-1 py-0.5 rounded">$15</code> or <code className="bg-white border px-1 py-0.5 rounded">Deluxe</code>) to display literal value.
        </div>

        {globalError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-4 mb-4 font-semibold">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Feature Name *"
            value={featureName}
            onChange={(e) => setFeatureName(e.target.value)}
            placeholder="e.g. Spa Gel Polish"
            error={errors.featureName?.[0]}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Essential value"
              value={essentialValue}
              onChange={(e) => setEssentialValue(e.target.value)}
              placeholder="check, - or custom value"
              error={errors.essentialValue?.[0]}
            />
            <FormField
              label="Signature value"
              value={signatureValue}
              onChange={(e) => setSignatureValue(e.target.value)}
              placeholder="check, - or custom value"
              error={errors.signatureValue?.[0]}
            />
            <FormField
              label="Premium value"
              value={premiumValue}
              onChange={(e) => setPremiumValue(e.target.value)}
              placeholder="check, - or custom value"
              error={errors.premiumValue?.[0]}
            />
            <FormField
              label="VIP value"
              value={vipValue}
              onChange={(e) => setVipValue(e.target.value)}
              placeholder="check, - or custom value"
              error={errors.vipValue?.[0]}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-[var(--admin-border)]/20 pt-4">
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
              className="bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer border-none shadow-sm flex items-center gap-1.5"
            >
              {editId ? <Save size={13} /> : <Plus size={13} />}
              <span>{saveLoading ? "Saving..." : editId ? "Save Row" : "Add Row"}</span>
            </button>
          </div>
        </form>
      </div>
      <AdminConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Comparison Feature"
        description="Are you sure you want to delete this comparison feature row? This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
export default PackageComparisonForm;
