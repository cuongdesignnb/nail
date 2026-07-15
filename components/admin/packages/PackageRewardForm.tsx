"use client";
import React, { useState, useEffect } from "react";
import { FormField, FormTextarea } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { AdminConfirmDialog } from "@/components/admin/ui";

export function PackageRewardForm() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");

  // Editor states
  const [editId, setEditId] = useState<string | null>(null);
  const [icon, setIcon] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [promoTitle, setPromoTitle] = useState("");
  const [promoValue, setPromoValue] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  const [buttonHref, setButtonHref] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Check if we are editing a promo card or standard reward
  const [isPromoType, setIsPromoType] = useState(false);

  useEffect(() => {
    fetchList();
  }, []);

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/package-rewards");
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

  const handleEdit = (rew: any) => {
    setEditId(rew.id);
    setIcon(rew.icon || "");
    setTitle(rew.title || "");
    setDescription(rew.description || "");
    setImage(rew.image || "");
    setImageAlt(rew.imageAlt || "");
    setPromoTitle(rew.promoTitle || "");
    setPromoValue(rew.promoValue || "");
    setButtonLabel(rew.buttonLabel || "");
    setButtonHref(rew.buttonHref || "");
    setSortOrder(rew.sortOrder || 0);
    setIsActive(rew.isActive ?? true);
    setIsPromoType(!!rew.promoValue);
    setErrors({});
    setGlobalError("");
  };

  const handleCancel = () => {
    setEditId(null);
    setIcon("");
    setTitle("");
    setDescription("");
    setImage("");
    setImageAlt("");
    setPromoTitle("");
    setPromoValue("");
    setButtonLabel("");
    setButtonHref("");
    setSortOrder(0);
    setIsActive(true);
    setIsPromoType(false);
    setErrors({});
    setGlobalError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrors({});
    setGlobalError("");

    const payload = {
      icon: icon || null,
      title,
      description,
      image: isPromoType ? image || null : null,
      imageAlt: isPromoType ? imageAlt || null : null,
      promoTitle: isPromoType ? promoTitle || null : null,
      promoValue: isPromoType ? promoValue || null : null,
      buttonLabel: isPromoType ? buttonLabel || null : null,
      buttonHref: isPromoType ? buttonHref || null : null,
      sortOrder: Number(sortOrder),
      isActive,
    };

    try {
      const url = editId
        ? `/api/admin/package-rewards/${editId}`
        : "/api/admin/package-rewards";
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
      const res = await fetch(`/api/admin/package-rewards/${deleteTarget}`, {
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
          Loyalty Rewards & Promos
        </h3>

        {loading ? (
          <p className="text-xs text-[var(--admin-muted)] italic py-6 text-center">Loading rewards...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-[var(--admin-border)]/20 text-[var(--admin-muted)]">
                  <th className="py-3 text-left">Type</th>
                  <th className="py-3 text-left">Title</th>
                  <th className="py-3 text-left">Description</th>
                  <th className="py-3 text-center">Order</th>
                  <th className="py-3 text-center">Status</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((rew) => (
                  <tr key={rew.id} className="border-b border-[var(--admin-border)]/10 hover:bg-[var(--admin-surface-muted)]">
                    <td className="py-3 font-semibold text-[var(--admin-accent)]">
                      {rew.promoValue ? "PROMO BLOCK" : "REWARD CARD"}
                    </td>
                    <td className="py-3 font-semibold text-[var(--admin-ink)]">{rew.title}</td>
                    <td className="py-3 text-[var(--admin-muted)] max-w-[200px] truncate">{rew.description}</td>
                    <td className="py-3 text-center">{rew.sortOrder}</td>
                    <td className="py-3 text-center">
                      <StatusBadge active={rew.isActive} />
                    </td>
                    <td className="py-3 text-right font-semibold">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEdit(rew)}
                          className="p-1.5 text-gray-500 hover:text-[var(--admin-accent)] bg-transparent border-none cursor-pointer"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(rew.id)}
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
          <span>{editId ? "Edit Reward Item" : "Add Reward Item"}</span>
          {editId && (
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
              <X size={15} />
            </button>
          )}
        </h3>

        {/* Reward Type Toggle */}
        <div className="flex bg-[var(--admin-surface-muted)] rounded-xl p-1 mb-4">
          <button
            type="button"
            onClick={() => setIsPromoType(false)}
            className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg border-none cursor-pointer transition-all ${
              !isPromoType ? "bg-[var(--admin-accent)] text-white shadow-sm" : "text-[var(--admin-muted)] bg-transparent hover:text-[var(--admin-accent)]"
            }`}
          >
            STANDARD CARD
          </button>
          <button
            type="button"
            onClick={() => setIsPromoType(true)}
            className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg border-none cursor-pointer transition-all ${
              isPromoType ? "bg-[var(--admin-accent)] text-white shadow-sm" : "text-[var(--admin-muted)] bg-transparent hover:text-[var(--admin-accent)]"
            }`}
          >
            PROMO BANNER CARD
          </button>
        </div>

        {globalError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-4 mb-4 font-semibold">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isPromoType ? (
            <FormField
              label="Lucide Icon Name *"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="e.g. percent, calendar, gift, gem"
              error={errors.icon?.[0]}
            />
          ) : null}

          <FormField
            label="Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isPromoType ? "Join & Save" : "Priority Booking"}
            error={errors.title?.[0]}
          />

          <FormTextarea
            label="Description *"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Reward perk description..."
            error={errors.description?.[0]}
            rows={2}
          />

          {isPromoType && (
            <div className="space-y-4 border-t border-[var(--admin-border)]/20 pt-4 mt-4">
              <h4 className="font-heading text-xs font-bold text-[var(--admin-accent)] mb-2">Promo Card Configurations</h4>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Promo Title"
                  value={promoTitle}
                  onChange={(e) => setPromoTitle(e.target.value)}
                  placeholder="e.g. Join & Save"
                  error={errors.promoTitle?.[0]}
                />
                <FormField
                  label="Promo Discount Value"
                  value={promoValue}
                  onChange={(e) => setPromoValue(e.target.value)}
                  placeholder="e.g. 15%"
                  error={errors.promoValue?.[0]}
                />
              </div>
              <MediaPickerField
                valueMode="url"
                label="Promo Image"
                value={image}
                alt={imageAlt}
                onChange={(url) => setImage(url || "")}
                onAltChange={(alt) => setImageAlt(alt)}
                folder="packages"
              />
              {errors.image?.[0] && <p className="text-xs text-rose-500">{errors.image[0]}</p>}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Button Label"
                  value={buttonLabel}
                  onChange={(e) => setButtonLabel(e.target.value)}
                  placeholder="Join Membership"
                  error={errors.buttonLabel?.[0]}
                />
                <FormField
                  label="Button Link (Href)"
                  value={buttonHref}
                  onChange={(e) => setButtonHref(e.target.value)}
                  placeholder="/booking"
                  error={errors.buttonHref?.[0]}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border-t border-[var(--admin-border)]/20 pt-4 mt-4">
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
              <span>{saveLoading ? "Saving..." : editId ? "Save Item" : "Create Item"}</span>
            </button>
          </div>
        </form>
      </div>
      <AdminConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Reward"
        description="Are you sure you want to delete this reward? This cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
export default PackageRewardForm;
