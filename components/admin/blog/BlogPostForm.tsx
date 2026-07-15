"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Plus, Save, Sparkles, X } from "lucide-react";
import { FormField, FormSelect, FormTextarea } from "@/components/common/FormField";
import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";
import type { MediaReference } from "@/lib/media/media.types";

interface BlogPostFormProps {
  categories: any[];
  initialData?: any;
  onSave: () => void;
  onCancel: () => void;
}

type Product = { image: string; name: string; description: string; shopUrl: string };
type Faq = { question: string; answer: string };

function parseList<T>(value: unknown, fallback: T[]): T[] {
  if (!value) return fallback;
  if (Array.isArray(value)) return value as T[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }
  return fallback;
}

function toMediaReference(data?: any): MediaReference | null {
  if (!data?.coverImage) return null;
  return {
    mediaId: data.coverMediaId || undefined,
    src: data.coverImage,
    alt: data.coverImageAlt || "",
  };
}

export function BlogPostForm({ categories, initialData, onSave, onCancel }: BlogPostFormProps) {
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<MediaReference | null>(null);
  const [coverImageAlt, setCoverImageAlt] = useState("");
  const [authorName, setAuthorName] = useState("Aera Team");
  const [authorAvatar, setAuthorAvatar] = useState("");
  const [authorRole, setAuthorRole] = useState("Nail Specialist");
  const [readTimeMinutes, setReadTimeMinutes] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isEditorsPick, setIsEditorsPick] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!initialData) return;
    setCategoryId(initialData.categoryId || "");
    setTitle(initialData.title || "");
    setSlug(initialData.slug || "");
    setExcerpt(initialData.excerpt || "");
    setContent(initialData.content || "");
    setCoverImage(toMediaReference(initialData));
    setCoverImageAlt(initialData.coverImageAlt || "");
    setAuthorName(initialData.authorName || "Aera Team");
    setAuthorAvatar(initialData.authorAvatar || "");
    setAuthorRole(initialData.authorRole || "Nail Specialist");
    setReadTimeMinutes(initialData.readTimeMinutes != null ? String(initialData.readTimeMinutes) : "");
    setStatus(initialData.status || "DRAFT");
    setIsFeatured(Boolean(initialData.isFeatured));
    setIsTrending(Boolean(initialData.isTrending));
    setIsEditorsPick(Boolean(initialData.isEditorsPick));
    setIsPinned(Boolean(initialData.isPinned));
    setSeoTitle(initialData.seoTitle || "");
    setSeoDescription(initialData.seoDescription || "");
    setSeoKeywords(initialData.seoKeywords || "");
    setFaqs(parseList<Faq>(initialData.faqs, []));
    setProducts(parseList<Product>(initialData.products, []));
    setScheduledAt(initialData.scheduledAt ? new Date(initialData.scheduledAt).toISOString().slice(0, 16) : "");
    setPublishedAt(initialData.publishedAt ? new Date(initialData.publishedAt).toISOString().slice(0, 16) : "");
  }, [initialData]);

  const safeCategories = useMemo(() => (Array.isArray(categories) ? categories : []), [categories]);

  const catOptions = [
    { value: "", label: "Select Category Tab *" },
    ...safeCategories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const statusOptions = [
    { value: "DRAFT", label: "Draft / Save Later" },
    { value: "PUBLISHED", label: "Publish Immediately" },
    { value: "SCHEDULED", label: "Schedule Publication" },
    { value: "ARCHIVED", label: "Archived" },
  ];

  const handleStatusChange = (nextStatus: string) => {
    setStatus(nextStatus);
    if (nextStatus === "PUBLISHED" && !publishedAt) {
      setPublishedAt(new Date().toISOString().slice(0, 16));
      setScheduledAt("");
    } else if (nextStatus === "SCHEDULED" && !scheduledAt) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduledAt(tomorrow.toISOString().slice(0, 16));
      setPublishedAt("");
    } else if (nextStatus === "DRAFT") {
      setPublishedAt("");
      setScheduledAt("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrors({});
    setGlobalError("");

    const payload = {
      categoryId: categoryId || null,
      title,
      slug: slug || undefined,
      excerpt: excerpt || null,
      content: content || null,
      coverImage: coverImage?.src || null,
      coverMediaId: coverImage?.mediaId || null,
      coverImageAlt: coverImageAlt || coverImage?.alt || null,
      authorName: authorName || null,
      authorAvatar: authorAvatar || null,
      authorRole: authorRole || null,
      readTimeMinutes: readTimeMinutes === "" ? null : Number(readTimeMinutes),
      status,
      isFeatured,
      isTrending,
      isEditorsPick,
      isPinned,
      scheduledAt: status === "SCHEDULED" && scheduledAt ? new Date(scheduledAt).toISOString() : null,
      publishedAt: status === "PUBLISHED" && publishedAt ? new Date(publishedAt).toISOString() : null,
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      seoKeywords: seoKeywords || null,
      faqs: faqs.length > 0 ? faqs : null,
      products: products.length > 0 ? products : null,
    };

    try {
      const res = await fetch(initialData ? `/api/admin/blog-posts/${initialData.id}` : "/api/admin/blog-posts", {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.errors) setErrors(json.errors);
        else setGlobalError(json.message || json.error || "Failed to save post");
      } else {
        onSave();
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Connection issue. Please retry.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury text-left font-sans max-w-5xl">
      <div className="flex justify-between items-center border-b border-[var(--admin-border)]/40 pb-4 mb-6">
        <h3 className="font-heading text-lg font-normal text-[var(--admin-ink)]">
          {initialData ? `Edit Article: ${initialData.title}` : "Compose New Journal Entry"}
        </h3>
        <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-full border-none bg-transparent cursor-pointer text-gray-400">
          <X size={18} />
        </button>
      </div>

      {globalError && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-4 mb-6 font-semibold">{globalError}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {initialData?.aiGenerated && (
          <div className="rounded-2xl border border-[var(--admin-border)]/40 bg-[var(--admin-surface-muted)] p-4 text-xs text-[var(--admin-ink)]">
            <div className="font-bold flex items-center gap-2"><Sparkles size={14} /> AI Generated Article</div>
            <div className="mt-1 text-[var(--admin-muted)]">Job: {initialData.aiContentJobId || "-"} | Language: {initialData.generatedLanguage || "-"}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <FormField label="Article Title *" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. How to Keep Your Gel Manicure Fresh" error={errors.title?.[0]} />
          </div>
          <div className="md:col-span-4">
            <FormSelect label="Category Tab *" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} options={catOptions} error={errors.categoryId?.[0]} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <FormField label="Custom URL Slug (Optional)" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Auto-generated if empty" error={errors.slug?.[0]} />
          </div>
          <div className="md:col-span-4">
            <FormField label="Read Time (Minutes)" type="number" value={readTimeMinutes} onChange={(e) => setReadTimeMinutes(e.target.value)} placeholder="e.g. 5" error={errors.readTimeMinutes?.[0]} />
          </div>
        </div>

        <FormTextarea label="Excerpt Summary (Card preview snippet) *" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief summary introducing the article topics..." error={errors.excerpt?.[0]} rows={2} />

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-[var(--admin-ink)] uppercase tracking-wider">Article Content *</label>
          <RichTextEditor value={content} onChange={setContent} placeholder="Write your detailed beauty story here..." minHeight="320px" />
          {errors.content?.[0] && <p className="text-[10px] text-rose-600 mt-1 font-semibold">{errors.content[0]}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[var(--admin-border)]/20 pt-6">
          <MediaPickerField valueMode="reference" label="Cover Image" value={coverImage} onChange={(image) => { setCoverImage(image); setCoverImageAlt(image?.alt || ""); }} folder="blog" aspectRatio="16/9" required />

          <div className="space-y-4">
            <label className="block text-xs font-semibold text-[var(--admin-ink)] uppercase tracking-wider">Author Details</label>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Author Name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
              <FormField label="Author Role" value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} />
            </div>
            <MediaPickerField valueMode="url" label="Author Avatar" value={authorAvatar} onChange={(value) => setAuthorAvatar(value || "")} folder="blog" aspectRatio="1/1" allowAltOverride={false} />
          </div>
        </div>

        <div className="border-t border-[var(--admin-border)]/20 pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField label="Featured Article (Hero)" type="checkbox" checked={isFeatured} onChange={(e: any) => setIsFeatured(e.target.checked)} />
          <FormField label="Trending Article" type="checkbox" checked={isTrending} onChange={(e: any) => setIsTrending(e.target.checked)} />
          <FormField label="Editor's Pick" type="checkbox" checked={isEditorsPick} onChange={(e: any) => setIsEditorsPick(e.target.checked)} />
          <FormField label="Pin to Top of List" type="checkbox" checked={isPinned} onChange={(e: any) => setIsPinned(e.target.checked)} />
        </div>

        <div className="border-t border-[var(--admin-border)]/20 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-[var(--admin-surface-muted)] p-5 rounded-3xl">
          <FormSelect label="Publication Status *" value={status} onChange={(e) => handleStatusChange(e.target.value)} options={statusOptions} error={errors.status?.[0]} />

          {status === "SCHEDULED" && (
            <DateInput label="Schedule Release Time *" value={scheduledAt} onChange={setScheduledAt} error={errors.scheduledAt?.[0]} />
          )}
          {status === "PUBLISHED" && (
            <DateInput label="Published Time (Custom)" value={publishedAt} onChange={setPublishedAt} />
          )}
        </div>

        <RepeaterSection
          title="Article FAQ Accordion"
          items={faqs}
          addLabel="Add FAQ Item"
          onAdd={() => setFaqs([...faqs, { question: "", answer: "" }])}
          render={(faq, idx) => (
            <>
              <FormField label={`Question #${idx + 1}`} value={faq.question} onChange={(e) => updateFaq(idx, { question: e.target.value })} placeholder="e.g. How often should I get my gel nails done?" />
              <FormTextarea label="Answer" value={faq.answer} onChange={(e) => updateFaq(idx, { answer: e.target.value })} rows={2} />
            </>
          )}
          onRemove={(idx) => setFaqs(faqs.filter((_, i) => i !== idx))}
        />

        <RepeaterSection
          title="Recommended Care Products"
          items={products}
          addLabel="Add Recommended Product"
          onAdd={() => setProducts([...products, { image: "", name: "", description: "", shopUrl: "" }])}
          render={(prod, idx) => (
            <>
              <MediaPickerField valueMode="url" label="Product Image" value={prod.image} onChange={(value) => updateProduct(idx, { image: value || "" })} folder="blog" aspectRatio="1/1" allowAltOverride={false} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField label="Product Name" value={prod.name} onChange={(e) => updateProduct(idx, { name: e.target.value })} />
                <FormField label="Description" value={prod.description} onChange={(e) => updateProduct(idx, { description: e.target.value })} />
                <FormField label="Shop URL Link" value={prod.shopUrl} onChange={(e) => updateProduct(idx, { shopUrl: e.target.value })} />
              </div>
            </>
          )}
          onRemove={(idx) => setProducts(products.filter((_, i) => i !== idx))}
        />

        <div className="border-t border-[var(--admin-border)]/20 pt-6 space-y-4">
          <h4 className="font-heading text-xs font-bold text-[var(--admin-accent)] flex items-center gap-1.5 uppercase"><Sparkles size={13} /> SEO & Metadata Configurations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="SEO Title Override" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
            <FormField label="SEO Keywords (comma separated)" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} />
          </div>
          <FormTextarea label="SEO Description Override" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-[var(--admin-border)]/20">
          <button type="button" onClick={onCancel} className="px-5 py-2.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full border-none cursor-pointer">Cancel</button>
          <button type="submit" disabled={saveLoading} className="bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white text-xs font-bold px-6 py-3 rounded-full cursor-pointer border-none shadow-sm flex items-center gap-1.5">
            <Save size={14} />
            <span>{saveLoading ? "Saving Article..." : "Save Article"}</span>
          </button>
        </div>
      </form>
    </div>
  );

  function updateFaq(index: number, patch: Partial<Faq>) {
    setFaqs(faqs.map((faq, i) => (i === index ? { ...faq, ...patch } : faq)));
  }

  function updateProduct(index: number, patch: Partial<Product>) {
    setProducts(products.map((product, i) => (i === index ? { ...product, ...patch } : product)));
  }
}

function DateInput({ label, value, onChange, error }: { label: string; value: string; onChange: (value: string) => void; error?: string }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-[var(--admin-ink)] uppercase tracking-wider flex items-center gap-1">
        <Calendar size={13} />
        <span>{label}</span>
      </label>
      <input type="datetime-local" value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-[var(--admin-border-strong)] px-4 py-2.5 text-xs text-[var(--admin-ink)] focus:border-[var(--admin-accent)] outline-none bg-white shadow-sm" />
      {error && <p className="text-[10px] text-rose-600 mt-1 font-semibold">{error}</p>}
    </div>
  );
}

function RepeaterSection<T>({ title, items, addLabel, onAdd, onRemove, render }: {
  title: string;
  items: T[];
  addLabel: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  render: (item: T, index: number) => React.ReactNode;
}) {
  return (
    <div className="border-t border-[var(--admin-border)]/20 pt-6 space-y-4">
      <h4 className="font-heading text-xs font-bold text-[var(--admin-accent)] flex items-center gap-1.5 uppercase"><Sparkles size={13} /> {title}</h4>
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div key={idx} className="bg-[var(--admin-surface-muted)] p-4 rounded-2xl border border-[var(--admin-border)]/40 space-y-3 relative">
            <button type="button" onClick={() => onRemove(idx)} className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer"><X size={14} /></button>
            {render(item, idx)}
          </div>
        ))}
        <button type="button" onClick={onAdd} className="bg-white hover:bg-[var(--admin-surface-muted)] text-[var(--admin-accent)] border border-[var(--admin-border)] px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer">
          <Plus size={13} />
          <span>{addLabel}</span>
        </button>
      </div>
    </div>
  );
}

export default BlogPostForm;
