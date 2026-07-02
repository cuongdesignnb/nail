"use client";
import React, { useState, useEffect } from "react";
import { FormField, FormTextarea, FormSelect } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit, Trash2, Star } from "lucide-react";
import Image from "next/image";

export function GalleryTestimonialForm() {
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
    setQuote(test.quote || "");
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
      avatar: avatar || null,
      avatarAlt: avatarAlt || null,
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
        resetForm();
        fetchTestimonials();
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Connection error occurred. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/gallery-testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchTestimonials();
      } else {
        alert("Failed to deactivate testimonial");
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Testimonials list */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury">
        <h3 className="font-heading text-lg font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
          Gallery Testimonials
        </h3>

        {loading ? (
          <p className="text-xs text-aera-muted italic py-4">Loading testimonials...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-xs text-aera-muted italic py-4">No testimonials added yet.</p>
        ) : (
          <div className="space-y-4">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="p-4 rounded-2xl border border-aera-champagne/40 bg-aera-champagne/5 hover:bg-aera-champagne/10 transition-colors flex gap-4 items-start"
              >
                {test.avatar ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-aera-champagne/15 border border-aera-champagne/30 shrink-0">
                    <Image src={test.avatar} alt={test.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-aera-accent/15 text-aera-accent flex items-center justify-center font-heading font-semibold shrink-0">
                    {test.name.charAt(0)}
                  </div>
                )}

                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h5 className="font-heading text-xs font-semibold text-aera-ink">{test.name}</h5>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEdit(test)}
                        className="p-1 text-aera-accent hover:bg-aera-accent/10 rounded border-none bg-transparent cursor-pointer"
                      >
                        <Edit size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(test.id)}
                        className="p-1 text-rose-500 hover:bg-rose-50 rounded border-none bg-transparent cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5 mt-1 mb-2">
                    {Array.from({ length: 5 }).map((_, sIdx) => (
                      <Star
                        key={sIdx}
                        size={10}
                        className={
                          sIdx < (test.rating || 5)
                            ? "fill-aera-gold text-aera-gold"
                            : "text-aera-champagne"
                        }
                      />
                    ))}
                  </div>

                  <p className="font-sans text-[11px] text-aera-muted leading-relaxed italic">
                    &quot;{test.quote}&quot;
                  </p>
                  
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[9px] text-gray-400">Order: {test.sortOrder}</span>
                    <StatusBadge active={test.isActive} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Form */}
      <div className="lg:col-span-5">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury"
        >
          <h3 className="font-heading text-base font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
            {editingId ? "Edit Testimonial" : "Create Testimonial"}
          </h3>

          {globalError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 mb-5">
              {globalError}
            </div>
          )}

          <FormField
            label="Client Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Jessica M."
            error={errors.name?.[0]}
            required
          />

          <FormSelect
            label="Rating Stars *"
            value={rating.toString()}
            onChange={(e) => setRating(Number(e.target.value))}
            options={ratingOptions}
            error={errors.rating?.[0]}
          />

          <FormField
            label="Avatar Image URL"
            value={avatar}
            onChange={(e) => {
              setAvatar(e.target.value);
              if (!avatarAlt) setAvatarAlt(name || "Client Avatar");
            }}
            placeholder="e.g. /images/client-1.jpg"
            error={errors.avatar?.[0]}
          />

          <FormField
            label="Avatar Alt Text"
            value={avatarAlt}
            onChange={(e) => setAvatarAlt(e.target.value)}
            placeholder="e.g. Portrait of Jessica"
            error={errors.avatarAlt?.[0]}
          />

          <FormField
            label="Sort Order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            error={errors.sortOrder?.[0]}
          />

          <FormTextarea
            label="Quote Text *"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Feedback quote from client..."
            error={errors.quote?.[0]}
            rows={4}
            required
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
              {formLoading ? "Saving..." : editingId ? "Update Testimonial" : "Create Testimonial"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default GalleryTestimonialForm;
