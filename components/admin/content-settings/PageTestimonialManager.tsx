"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FormField, FormTextarea, FormSelect } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Plus, Edit2, Trash2, X, Save, Star } from "lucide-react";

function TestimonialManagerPanel() {
  const searchParams = useSearchParams();
  const pageKey = searchParams.get("pageKey") || "home";

  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");

  // Editor states
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarAlt, setAvatarAlt] = useState("");
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchTestimonials();
    handleCancel();
  }, [pageKey]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/page-testimonials?pageKey=${pageKey}`);
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

  const handleEdit = (test: any) => {
    setEditId(test.id);
    setName(test.name || "");
    setRole(test.role || "");
    setAvatar(test.avatar || "");
    setAvatarAlt(test.avatarAlt || "");
    setRating(test.rating ?? 5);
    setQuote(test.quote || "");
    setSortOrder(test.sortOrder || 0);
    setIsActive(test.isActive ?? true);
    setErrors({});
    setGlobalError("");
  };

  const handleCancel = () => {
    setEditId(null);
    setName("");
    setRole("");
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
    setSaveLoading(true);
    setErrors({});
    setGlobalError("");

    const payload = {
      pageKey,
      name,
      role: role || null,
      avatar: avatar || null,
      avatarAlt: avatarAlt || null,
      rating: Number(rating),
      quote,
      sortOrder: Number(sortOrder),
      isActive,
    };

    try {
      const url = editId ? `/api/admin/page-testimonials/${editId}` : "/api/admin/page-testimonials";
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
        fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Connection error.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/page-testimonials/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const ratingOptions = [
    { value: "5", label: "5 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "2", label: "2 Stars" },
    { value: "1", label: "1 Star" },
  ];

  const pageLabel = pageKey.charAt(0).toUpperCase() + pageKey.slice(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left font-sans">
      {/* List side */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[var(--admin-border)]/45 shadow-luxury">
        <h3 className="font-heading text-sm font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
          Testimonials List ({pageLabel})
        </h3>

        {loading ? (
          <p className="text-xs text-[var(--admin-muted)] italic py-6 text-center">Loading list...</p>
        ) : (
          <div className="space-y-4">
            {list.map((test) => (
              <div key={test.id} className="p-4 border border-[var(--admin-border)] rounded-2xl flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, sIdx) => (
                      <Star
                        key={sIdx}
                        size={10}
                        className={
                          sIdx < test.rating
                            ? "fill-[var(--admin-warning)] text-[var(--admin-warning)]"
                            : "text-[var(--admin-border)]"
                        }
                      />
                    ))}
                  </div>
                  <p className="text-xs italic text-[var(--admin-muted)]">&quot;{test.quote}&quot;</p>
                  <h4 className="font-semibold text-xs text-[var(--admin-ink)] pt-1">
                    {test.name} {test.role ? `— ${test.role}` : ""}
                  </h4>
                  <div className="flex gap-3 items-center pt-2">
                    <span className="text-[9px] text-gray-400">Order: {test.sortOrder}</span>
                    <StatusBadge active={test.isActive} />
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(test)}
                    className="p-1.5 text-gray-500 hover:text-[var(--admin-accent)] bg-transparent border-none cursor-pointer"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(test.id)}
                    className="p-1.5 text-gray-500 hover:text-rose-600 bg-transparent border-none cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            {list.length === 0 && (
              <p className="text-xs text-[var(--admin-muted)] italic py-6 text-center">No reviews found for this page.</p>
            )}
          </div>
        )}
      </div>

      {/* Editor Form side */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[var(--admin-border)]/45 shadow-luxury self-start">
        <h3 className="font-heading text-sm font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3 flex justify-between items-center">
          <span>{editId ? "Edit Testimonial" : "Add Testimonial"}</span>
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
            label="Client Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Emily R."
            error={errors.name?.[0]}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Role (e.g. Verified Client)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Verified Client"
              error={errors.role?.[0]}
            />
            <FormSelect
              label="Rating *"
              value={rating.toString()}
              onChange={(e) => setRating(Number(e.target.value))}
              options={ratingOptions}
              error={errors.rating?.[0]}
            />
          </div>
          <FormTextarea
            label="Feedback quote *"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Quote review text..."
            error={errors.quote?.[0]}
            rows={3}
          />
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
              <span>{saveLoading ? "Saving..." : editId ? "Save Review" : "Add Review"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PageTestimonialManager() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading testimonial content...</div>}>
      <TestimonialManagerPanel />
    </Suspense>
  );
}
export default PageTestimonialManager;
