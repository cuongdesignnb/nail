"use client";
import React, { useState, useEffect } from "react";
import { FormField, FormTextarea, FormSelect } from "@/components/common/FormField";
import { Plus, X, Image as ImageIcon, Save, Sparkles, Calendar } from "lucide-react";
import { MediaPickerModal } from "./MediaPickerModal";
import Image from "next/image";

interface BlogPostFormProps {
  categories: any[];
  initialData?: any;
  onSave: () => void;
  onCancel: () => void;
}

export function BlogPostForm({ categories, initialData, onSave, onCancel }: BlogPostFormProps) {
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");

  // Media picker states
  const [activePickerTarget, setActivePickerTarget] = useState<string | null>(null);

  // Form fields
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
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

  // SEO metadata fields
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [products, setProducts] = useState<{ image: string; name: string; description: string; shopUrl: string }[]>([]);

  useEffect(() => {
    if (initialData) {
      setCategoryId(initialData.categoryId || "");
      setTitle(initialData.title || "");
      setSlug(initialData.slug || "");
      setExcerpt(initialData.excerpt || "");
      setContent(initialData.content || "");
      setCoverImage(initialData.coverImage || "");
      setCoverImageAlt(initialData.coverImageAlt || "");
      setAuthorName(initialData.authorName || "Aera Team");
      setAuthorAvatar(initialData.authorAvatar || "");
      setAuthorRole(initialData.authorRole || "Nail Specialist");
      setReadTimeMinutes(initialData.readTimeMinutes !== null && initialData.readTimeMinutes !== undefined ? initialData.readTimeMinutes.toString() : "");
      setStatus(initialData.status || "DRAFT");
      setIsFeatured(initialData.isFeatured ?? false);
      setIsTrending(initialData.isTrending ?? false);
      setIsEditorsPick(initialData.isEditorsPick ?? false);
      setIsPinned(initialData.isPinned ?? false);
      setSeoTitle(initialData.seoTitle || "");
      setSeoDescription(initialData.seoDescription || "");
      setSeoKeywords(initialData.seoKeywords || "");
      setFaqs(initialData.faqs ? (typeof initialData.faqs === "string" ? JSON.parse(initialData.faqs) : initialData.faqs) : []);
      setProducts(initialData.products ? (typeof initialData.products === "string" ? JSON.parse(initialData.products) : initialData.products) : []);

      // Date parsing
      if (initialData.scheduledAt) {
        setScheduledAt(new Date(initialData.scheduledAt).toISOString().slice(0, 16));
      } else {
        setScheduledAt("");
      }
      if (initialData.publishedAt) {
        setPublishedAt(new Date(initialData.publishedAt).toISOString().slice(0, 16));
      } else {
        setPublishedAt("");
      }
    }
  }, [initialData]);

  const handleMediaSelect = (url: string, alt: string) => {
    if (activePickerTarget === "coverImage") {
      setCoverImage(url);
      setCoverImageAlt(alt || title);
    } else if (activePickerTarget === "authorAvatar") {
      setAuthorAvatar(url);
    } else if (activePickerTarget && activePickerTarget.startsWith("product-")) {
      const idx = Number(activePickerTarget.split("-")[1]);
      const newProds = [...products];
      if (newProds[idx]) {
        newProds[idx].image = url;
        setProducts(newProds);
      }
    }
    setActivePickerTarget(null);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    if (newStatus === "PUBLISHED" && !publishedAt) {
      setPublishedAt(new Date().toISOString().slice(0, 16));
      setScheduledAt("");
    } else if (newStatus === "SCHEDULED" && !scheduledAt) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setScheduledAt(tomorrow.toISOString().slice(0, 16));
      setPublishedAt("");
    } else if (newStatus === "DRAFT") {
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
      coverImage: coverImage || null,
      coverImageAlt: coverImageAlt || null,
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
      const url = initialData ? `/api/admin/blog-posts/${initialData.id}` : "/api/admin/blog-posts";
      const method = initialData ? "PUT" : "POST";

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
          setGlobalError(json.message || "Failed to save post");
        }
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

  const catOptions = [
    { value: "", label: "Select Category Tab *" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const statusOptions = [
    { value: "DRAFT", label: "Draft / Save Later" },
    { value: "PUBLISHED", label: "Publish Immediately" },
    { value: "SCHEDULED", label: "Schedule Publication" },
    { value: "ARCHIVED", label: "Archived" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury text-left font-sans max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-aera-champagne/40 pb-4 mb-6">
        <h3 className="font-heading text-lg font-normal text-aera-ink">
          {initialData ? `Edit Article: ${initialData.title}` : "Compose New Journal Entry"}
        </h3>
        <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-full border-none bg-transparent cursor-pointer text-gray-400">
          <X size={18} />
        </button>
      </div>

      {globalError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-4 mb-6 font-semibold">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title and slug */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <FormField
              label="Article Title *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. How to Keep Your Gel Manicure Fresh"
              error={errors.title?.[0]}
            />
          </div>
          <div className="md:col-span-4">
            <FormSelect
              label="Category Tab *"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={catOptions}
              error={errors.categoryId?.[0]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8">
            <FormField
              label="Custom URL Slug (Optional)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Auto-generated if empty"
              error={errors.slug?.[0]}
            />
          </div>
          <div className="md:col-span-4">
            <FormField
              label="Read Time (Minutes)"
              type="number"
              value={readTimeMinutes}
              onChange={(e) => setReadTimeMinutes(e.target.value)}
              placeholder="e.g. 5"
              error={errors.readTimeMinutes?.[0]}
            />
          </div>
        </div>

        {/* Excerpt */}
        <FormTextarea
          label="Excerpt Summary (Card preview snippet) *"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief summary introducing the article topics..."
          error={errors.excerpt?.[0]}
          rows={2}
        />

        {/* Content Body Editor */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-aera-ink uppercase tracking-wider">
            Article Content (HTML Supported) *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="<p>Write your detailed beauty story here...</p><h3>Section Title</h3><p>More paragraphs...</p>"
            rows={10}
            className="w-full rounded-2xl border border-aera-champagne/60 px-4 py-3 text-xs font-mono text-aera-ink focus:border-aera-accent outline-none bg-white shadow-sm"
          />
          {errors.content?.[0] && <p className="text-[10px] text-rose-600 mt-1 font-semibold">{errors.content[0]}</p>}
        </div>

        {/* Image configurations with Picker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-aera-champagne/20 pt-6">
          {/* Cover image picker */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-aera-ink uppercase tracking-wider">Cover Image *</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                placeholder="No image chosen"
                value={coverImage}
                className="flex-grow rounded-xl border border-aera-champagne/60 px-3 py-2 text-xs outline-none bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setActivePickerTarget("coverImage")}
                className="bg-aera-cream hover:bg-aera-champagne/30 text-aera-accent border border-aera-champagne px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon size={13} />
                <span>Browse</span>
              </button>
            </div>
            {coverImage && (
              <div className="relative aspect-[16/9] max-w-[200px] rounded-xl overflow-hidden border">
                <Image src={coverImage} alt="Cover Preview" fill className="object-cover" />
              </div>
            )}
            <FormField
              label="Cover Image Alt Text"
              value={coverImageAlt}
              onChange={(e) => setCoverImageAlt(e.target.value)}
              placeholder="e.g. Manicure glossy detailing"
            />
          </div>

          {/* Author configurations */}
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-aera-ink uppercase tracking-wider">Author Details</label>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Author Name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
              <FormField
                label="Author Role"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
              />
            </div>
            {/* Author Avatar Picker */}
            <div className="space-y-2">
              <label className="block text-[10px] font-semibold text-aera-muted uppercase">Author Avatar URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  placeholder="No avatar chosen"
                  value={authorAvatar}
                  className="flex-grow rounded-xl border border-aera-champagne/60 px-3 py-2 text-xs outline-none bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setActivePickerTarget("authorAvatar")}
                  className="bg-aera-cream hover:bg-aera-champagne/30 text-aera-accent border border-aera-champagne px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <ImageIcon size={13} />
                  <span>Choose</span>
                </button>
              </div>
              {authorAvatar && (
                <div className="relative w-8 h-8 rounded-full overflow-hidden border">
                  <Image src={authorAvatar} alt="Author Avatar Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Highlight switches & Pinned flags */}
        <div className="border-t border-aera-champagne/20 pt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <FormField
            label="Featured Article (Hero)"
            type="checkbox"
            checked={isFeatured}
            onChange={(e: any) => setIsFeatured(e.target.checked)}
          />
          <FormField
            label="Trending Article"
            type="checkbox"
            checked={isTrending}
            onChange={(e: any) => setIsTrending(e.target.checked)}
          />
          <FormField
            label="Editor's Pick"
            type="checkbox"
            checked={isEditorsPick}
            onChange={(e: any) => setIsEditorsPick(e.target.checked)}
          />
          <FormField
            label="Pin to Top of List"
            type="checkbox"
            checked={isPinned}
            onChange={(e: any) => setIsPinned(e.target.checked)}
          />
        </div>

        {/* Status publication details & schedules */}
        <div className="border-t border-aera-champagne/20 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-aera-cream/15 p-5 rounded-3xl">
          <FormSelect
            label="Publication Status *"
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            options={statusOptions}
            error={errors.status?.[0]}
          />

          {status === "SCHEDULED" && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-aera-ink uppercase tracking-wider flex items-center gap-1 text-aera-accent">
                <Calendar size={13} />
                <span>Schedule Release Time *</span>
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full rounded-xl border border-aera-champagne/60 px-4 py-2.5 text-xs text-aera-ink focus:border-aera-accent outline-none bg-white shadow-sm"
              />
              {errors.scheduledAt?.[0] && <p className="text-[10px] text-rose-600 mt-1 font-semibold">{errors.scheduledAt[0]}</p>}
            </div>
          )}

          {status === "PUBLISHED" && (
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-aera-ink uppercase tracking-wider flex items-center gap-1">
                <Calendar size={13} />
                <span>Published Time (Custom)</span>
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full rounded-xl border border-aera-champagne/60 px-4 py-2.5 text-xs text-aera-ink focus:border-aera-accent outline-none bg-white shadow-sm"
              />
            </div>
          )}
        </div>

        {/* FAQ Repeater Section */}
        <div className="border-t border-aera-champagne/20 pt-6 space-y-4">
          <h4 className="font-heading text-xs font-bold text-aera-accent flex items-center gap-1.5 uppercase">
            <Sparkles size={13} />
            Article FAQ Accordion (Repeater)
          </h4>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-aera-cream/15 p-4 rounded-2xl border border-aera-champagne/40 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => {
                    setFaqs(faqs.filter((_, fIdx) => fIdx !== idx));
                  }}
                  className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer"
                >
                  <X size={14} />
                </button>
                <div className="grid grid-cols-1 gap-2">
                  <FormField
                    label={`Question #${idx + 1}`}
                    value={faq.question}
                    onChange={(e) => {
                      const newFaqs = [...faqs];
                      newFaqs[idx].question = e.target.value;
                      setFaqs(newFaqs);
                    }}
                    placeholder="e.g. How often should I get my gel nails done?"
                  />
                  <FormTextarea
                    label="Answer"
                    value={faq.answer}
                    onChange={(e) => {
                      const newFaqs = [...faqs];
                      newFaqs[idx].answer = e.target.value;
                      setFaqs(newFaqs);
                    }}
                    placeholder="Write detailed answer..."
                    rows={2}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFaqs([...faqs, { question: "", answer: "" }])}
              className="bg-white hover:bg-aera-cream text-aera-accent border border-aera-champagne px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} />
              <span>Add FAQ Item</span>
            </button>
          </div>
        </div>

        {/* Recommended Products Repeater Section */}
        <div className="border-t border-aera-champagne/20 pt-6 space-y-4">
          <h4 className="font-heading text-xs font-bold text-aera-accent flex items-center gap-1.5 uppercase">
            <Sparkles size={13} />
            Recommended Care Products (Repeater)
          </h4>
          <div className="space-y-4">
            {products.map((prod, idx) => (
              <div key={idx} className="bg-aera-cream/15 p-4 rounded-2xl border border-aera-champagne/40 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => {
                    setProducts(products.filter((_, pIdx) => pIdx !== idx));
                  }}
                  className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 bg-transparent border-none cursor-pointer"
                >
                  <X size={14} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[11px] font-bold text-aera-ink uppercase">Product Image</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        placeholder="No image chosen"
                        value={prod.image}
                        className="flex-grow rounded-xl border border-aera-champagne/60 px-3 py-2 text-xs outline-none bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => setActivePickerTarget(`product-${idx}`)}
                        className="bg-aera-cream hover:bg-aera-champagne/30 text-aera-accent border border-aera-champagne px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <ImageIcon size={12} />
                        <span>Browse</span>
                      </button>
                    </div>
                    {prod.image && (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border">
                        <Image src={prod.image} alt="Product Preview" fill className="object-cover" />
                      </div>
                    )}
                  </div>

                  <FormField
                    label="Product Name"
                    value={prod.name}
                    onChange={(e) => {
                      const newProds = [...products];
                      newProds[idx].name = e.target.value;
                      setProducts(newProds);
                    }}
                    placeholder="e.g. Cuticle Oil"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Description"
                    value={prod.description}
                    onChange={(e) => {
                      const newProds = [...products];
                      newProds[idx].description = e.target.value;
                      setProducts(newProds);
                    }}
                    placeholder="e.g. Nourish & strengthen for healthy cuticles."
                  />
                  <FormField
                    label="Shop URL Link"
                    value={prod.shopUrl}
                    onChange={(e) => {
                      const newProds = [...products];
                      newProds[idx].shopUrl = e.target.value;
                      setProducts(newProds);
                    }}
                    placeholder="e.g. /booking or shop-link"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setProducts([...products, { image: "", name: "", description: "", shopUrl: "" }])}
              className="bg-white hover:bg-aera-cream text-aera-accent border border-aera-champagne px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} />
              <span>Add Recommended Product</span>
            </button>
          </div>
        </div>

        {/* SEO configs tabs section */}
        <div className="border-t border-aera-champagne/20 pt-6 space-y-4">
          <h4 className="font-heading text-xs font-bold text-aera-accent flex items-center gap-1.5 uppercase">
            <Sparkles size={13} />
            SEO & Metadata Configurations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="SEO Title Override"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder="e.g. Keep Gel Manicures Fresh Longer | Aera"
            />
            <FormField
              label="SEO Keywords (comma separated)"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="gel manicure, nail care, healthy nails"
            />
          </div>
          <FormTextarea
            label="SEO Description Override"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="Custom SEO meta description for web crawls..."
            rows={2}
          />
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-aera-champagne/20">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full border-none cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saveLoading}
            className="bg-aera-accent hover:bg-aera-accentHover text-white text-xs font-bold px-6 py-3 rounded-full cursor-pointer border-none shadow-sm flex items-center gap-1.5"
          >
            <Save size={14} />
            <span>{saveLoading ? "Saving Article..." : "Save Article"}</span>
          </button>
        </div>
      </form>

      {/* Media Picker Modal Dialog */}
      {activePickerTarget && (
        <MediaPickerModal
          onSelect={handleMediaSelect}
          onClose={() => setActivePickerTarget(null)}
        />
      )}
    </div>
  );
}
export default BlogPostForm;
