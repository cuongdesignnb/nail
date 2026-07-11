"use client";
import React, { useState, useEffect } from "react";
import { FormField, FormTextarea, FormSelect } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit, Trash2, Star } from "lucide-react";
import Image from "next/image";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import { AdminConfirmDialog, useToast } from "@/components/admin/ui";
import { verifyGalleryMutation } from "@/lib/gallery/verify-gallery-mutation";

export function GalleryTestimonialForm() {
  const toast = useToast();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarAlt, setAvatarAlt] = useState("");
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Delete state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/gallery-testimonials");
      if (res.ok) {
        const json = await res.json();
        setTestimonials(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (test: any) => {
    setEditingId(test.id);
    setName(test.name);
    setAvatar(test.avatar || "");
    setAvatarAlt(test.avatarAlt || "");
    setRating(test.rating || 5);
    setQuote(test.quote);
    setSortOrder(test.sortOrder || 0);
    setIsActive(test.isActive !== false);
    setErrors({});
    setGlobalError("");
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setAvatar("");
    setAvatarAlt("");
    setRating(5);
    setQuote("");
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
      avatar,
      avatarAlt,
      rating: Number(rating),
      quote,
      sortOrder: Number(sortOrder),
      isActive,
    };

    try {
      const url = editingId
        ? `/api/admin/gallery-testimonials/${editingId}`
        : "/api/admin/gallery-testimonials";
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
          setGlobalError(json.message || "Failed to save testimonial");
        }
      } else {
        await verifyGalleryMutation("gallery-testimonials", json.data, payload);
        resetForm();
        await fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
      setGlobalError(err instanceof Error ? err.message : "Connection error occurred. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`/api/admin/gallery-testimonials/${deleteTargetId}`, { method: "DELETE" });
      if (res.ok) {
        fetchTestimonials();
        toast.success("Testimonial deactivated successfully.");
      } else {
        toast.error("Failed to deactivate testimonial");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while deactivating.");
    } finally {
      setDeleteTargetId(null);
    }
  };

  const ratingOptions = [
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "2", label: "2 Stars" },
    { value: "1", label: "1 Star" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Testimonials list */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury">
        <h3 className="font-heading text-lg font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
          Design Testimonials
        </h3>

        {loading ? (
          <p className="text-xs text-[var(--admin-muted)] italic py-4">Loading testimonials...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-xs text-[var(--admin-muted)] italic py-4">No testimonials added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-[var(--admin-ink)]">
              <thead>
                <tr className="border-b border-[var(--admin-border)]/20 text-[var(--admin-muted)]">
                  <th className="py-2 text-left">Customer</th>
                  <th className="py-2 text-left">Quote</th>
                  <th className="py-2 text-center">Rating</th>
                  <th className="py-2 text-center">Status</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((test) => (
                  <tr
                    key={test.id}
                    className="border-b border-[var(--admin-border)]/10 hover:bg-[var(--admin-surface-hover)] transition-colors"
                  >
                    <td className="py-3 pr-2">
                      <div className="flex items-center gap-2">
                        {test.avatar && (
                          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[var(--admin-border)]/45 shrink-0">
                            <Image src={test.avatar} alt={test.name} fill className="object-cover" />
                          </div>
                        )}
                        <span className="font-semibold text-[var(--admin-ink)]">{test.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-[var(--admin-muted)] italic max-w-[200px] truncate">
                      &quot;{test.quote}&quot;
                    </td>
                    <td className="py-3 text-center">
                      <div className="inline-flex text-amber-500 gap-0.5">
                        {Array.from({ length: test.rating || 5 }).map((_, i) => (
                          <Star key={i} size={10} fill="currentColor" stroke="none" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <StatusBadge active={test.isActive} />
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleEdit(test)}
                          className="p-1.5 hover:bg-[var(--admin-surface-hover)] text-[var(--admin-muted)] hover:text-[var(--admin-accent)] rounded-full border-none bg-transparent cursor-pointer transition-colors"
                          title="Edit"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(test.id)}
                          className="p-1.5 hover:bg-red-50 text-[var(--admin-muted)] hover:text-red-600 rounded-full border-none bg-transparent cursor-pointer transition-colors"
                          title="Deactivate"
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

      {/* Editor Form */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury self-start font-sans">
        <h3 className="font-heading text-lg font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
          {editingId ? "Edit Testimonial" : "New Testimonial"}
        </h3>

        {globalError && (
          <div className="bg-red-50 border border-red-150 text-red-700 text-xs rounded-xl p-4 mb-4 font-semibold">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <FormField
            label="Customer Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sandra M."
            error={errors.name?.[0]}
            required
          />

          <MediaPickerField
            label="Customer Avatar (Optional)"
            value={avatar}
            alt={avatarAlt}
            onChange={(url) => setAvatar(url)}
            onAltChange={(alt) => setAvatarAlt(alt)}
            folder="avatars"
          />

          <FormSelect
            label="Rating *"
            value={rating.toString()}
            onChange={(e) => setRating(Number(e.target.value))}
            options={ratingOptions}
            error={errors.rating?.[0]}
          />

          <FormTextarea
            label="Quote Feedback *"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Feedback quote from customer..."
            error={errors.quote?.[0]}
            rows={4}
            required
          />

          <FormField
            label="Sort Order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            placeholder="0"
            error={errors.sortOrder?.[0]}
          />

          <label className="inline-flex items-center gap-2 cursor-pointer font-sans text-xs mt-2 mb-6">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--admin-border)] accent-[var(--admin-accent)] cursor-pointer"
            />
            <span>Active Status</span>
          </label>

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
              {formLoading ? "Saving..." : editingId ? "Update Testimonial" : "Create Testimonial"}
            </button>
          </div>
        </form>
      </div>

      {/* Confirm Deactivate Dialog */}
      <AdminConfirmDialog
        open={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Deactivate Testimonial"
        description="Are you sure you want to deactivate this testimonial? This action will hide it from the public site."
        confirmLabel="Deactivate"
        variant="danger"
      />
    </div>
  );
}
export default GalleryTestimonialForm;
