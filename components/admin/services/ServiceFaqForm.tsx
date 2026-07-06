"use client";
import React, { useState, useEffect } from "react";
import { FormField, FormTextarea } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Edit, Trash2 } from "lucide-react";
import { AdminConfirmDialog, useToast } from "@/components/admin/ui";

export function ServiceFaqForm() {
  const toast = useToast();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  // Form fields
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/service-faqs");
      if (res.ok) {
        const json = await res.json();
        setFaqs(json.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq: any) => {
    setEditingId(faq.id);
    setQuestion(faq.question || "");
    setAnswer(faq.answer || "");
    setSortOrder(faq.sortOrder || 0);
    setIsActive(faq.isActive !== false);
    setErrors({});
    setGlobalError("");
  };

  const resetForm = () => {
    setEditingId(null);
    setQuestion("");
    setAnswer("");
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
      question,
      answer,
      sortOrder: Number(sortOrder),
      isActive,
    };

    try {
      const url = editingId ? `/api/admin/service-faqs/${editingId}` : "/api/admin/service-faqs";
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
          setGlobalError(json.message || "Failed to save FAQ");
        }
      } else {
        resetForm();
        fetchFaqs();
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
      const res = await fetch(`/api/admin/service-faqs/${deleteTarget}`, { method: "DELETE" });
      if (res.ok) {
        fetchFaqs();
      } else {
        toast.toast({ type: "error", title: "Failed to deactivate FAQ" });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* FAQ list */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury">
        <h3 className="font-heading text-lg font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
          FAQs
        </h3>

        {loading ? (
          <p className="text-xs text-[var(--admin-muted)] italic py-4">Loading FAQs...</p>
        ) : faqs.length === 0 ? (
          <p className="text-xs text-[var(--admin-muted)] italic py-4">No FAQs added yet.</p>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4 border border-[var(--admin-border)] rounded-xl bg-[var(--admin-surface-muted)] hover:bg-white transition-all duration-200">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-heading text-xs font-semibold text-[var(--admin-ink)] mb-1">{faq.question}</h4>
                    <p className="font-sans text-[11px] text-[var(--admin-muted)] mt-2 leading-relaxed">{faq.answer}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-[10px] text-[var(--admin-muted)]">Order: {faq.sortOrder}</span>
                      <StatusBadge active={faq.isActive} />
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="p-1 text-[var(--admin-accent)] hover:bg-[var(--admin-accent)]/10 rounded border-none bg-transparent cursor-pointer"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(faq.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded border-none bg-transparent cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Form */}
      <div className="lg:col-span-5">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury">
          <h3 className="font-heading text-base font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
            {editingId ? "Edit FAQ" : "Add FAQ"}
          </h3>

          {globalError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3 mb-5">
              {globalError}
            </div>
          )}

          <FormField
            label="Question *"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. How long do manicures last?"
            error={errors.question?.[0]}
            required
          />

          <FormTextarea
            label="Answer *"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Provide a thorough answer..."
            error={errors.answer?.[0]}
            required
            rows={4}
          />

          <FormField
            label="Sort Order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
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
              {formLoading ? "Saving..." : editingId ? "Update FAQ" : "Save FAQ"}
            </button>
          </div>
        </form>
      </div>
      <AdminConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Deactivate FAQ"
        description="Are you sure you want to deactivate this FAQ? This cannot be undone."
        confirmLabel="Deactivate"
        variant="danger"
      />
    </div>
  );
}
export default ServiceFaqForm;
