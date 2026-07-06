"use client";
import React, { useState, useEffect } from "react";
import { FormField, FormTextarea } from "@/components/common/FormField";
import { Save, Image as ImageIcon, Sparkles } from "lucide-react";
import { MediaPickerModal } from "./MediaPickerModal";
import Image from "next/image";

export function BlogSettingsForm() {
  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [successMsg, setSuccessMsg] = useState("");
  const [globalError, setGlobalError] = useState("");

  // Media picker target
  const [showPicker, setShowPicker] = useState(false);

  // Form states
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [heroEyebrow, setHeroEyebrow] = useState("");
  const [heroTitle, setHeroTitle] = useState("");
  const [heroHighlight, setHeroHighlight] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [heroImageAlt, setHeroImageAlt] = useState("");
  const [primaryButtonLabel, setPrimaryButtonLabel] = useState("");
  const [primaryButtonHref, setPrimaryButtonHref] = useState("");
  const [secondaryButtonLabel, setSecondaryButtonLabel] = useState("");
  const [secondaryButtonHref, setSecondaryButtonHref] = useState("");

  const [latestTitle, setLatestTitle] = useState("");
  const [browseTitle, setBrowseTitle] = useState("");
  const [editorsPickTitle, setEditorsPickTitle] = useState("");
  const [testimonialsTitle, setTestimonialsTitle] = useState("");

  const [sidebarCategoriesTitle, setSidebarCategoriesTitle] = useState("");
  const [sidebarTrendingTitle, setSidebarTrendingTitle] = useState("");
  const [newsletterTitle, setNewsletterTitle] = useState("");
  const [newsletterDescription, setNewsletterDescription] = useState("");
  const [newsletterPlaceholder, setNewsletterPlaceholder] = useState("");
  const [newsletterButtonLabel, setNewsletterButtonLabel] = useState("");

  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaDescription, setCtaDescription] = useState("");
  const [ctaButtonLabel, setCtaButtonLabel] = useState("");
  const [ctaButtonHref, setCtaButtonHref] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [hours, setHours] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog-page-settings");
      if (res.ok) {
        const json = await res.json();
        const d = json.data || {};
        setSeoTitle(d.seoTitle || "");
        setSeoDescription(d.seoDescription || "");
        setHeroEyebrow(d.heroEyebrow || "");
        setHeroTitle(d.heroTitle || "");
        setHeroHighlight(d.heroHighlight || "");
        setHeroDescription(d.heroDescription || "");
        setHeroImage(d.heroImage || "");
        setHeroImageAlt(d.heroImageAlt || "");
        setPrimaryButtonLabel(d.primaryButtonLabel || "");
        setPrimaryButtonHref(d.primaryButtonHref || "");
        setSecondaryButtonLabel(d.secondaryButtonLabel || "");
        setSecondaryButtonHref(d.secondaryButtonHref || "");
        setLatestTitle(d.latestTitle || "");
        setBrowseTitle(d.browseTitle || "");
        setEditorsPickTitle(d.editorsPickTitle || "");
        setTestimonialsTitle(d.testimonialsTitle || "");
        setSidebarCategoriesTitle(d.sidebarCategoriesTitle || "");
        setSidebarTrendingTitle(d.sidebarTrendingTitle || "");
        setNewsletterTitle(d.newsletterTitle || "");
        setNewsletterDescription(d.newsletterDescription || "");
        setNewsletterPlaceholder(d.newsletterPlaceholder || "");
        setNewsletterButtonLabel(d.newsletterButtonLabel || "");
        setCtaTitle(d.ctaTitle || "");
        setCtaDescription(d.ctaDescription || "");
        setCtaButtonLabel(d.ctaButtonLabel || "");
        setCtaButtonHref(d.ctaButtonHref || "");
        setPhone(d.phone || "");
        setEmail(d.email || "");
        setAddress(d.address || "");
        setHours(d.hours || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMediaSelect = (url: string, alt: string) => {
    setHeroImage(url);
    setHeroImageAlt(alt || heroHighlight);
    setShowPicker(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrors({});
    setSuccessMsg("");
    setGlobalError("");

    const payload = {
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      heroEyebrow: heroEyebrow || null,
      heroTitle: heroTitle || null,
      heroHighlight: heroHighlight || null,
      heroDescription: heroDescription || null,
      heroImage: heroImage || null,
      heroImageAlt: heroImageAlt || null,
      primaryButtonLabel: primaryButtonLabel || null,
      primaryButtonHref: primaryButtonHref || null,
      secondaryButtonLabel: secondaryButtonLabel || null,
      secondaryButtonHref: secondaryButtonHref || null,
      latestTitle: latestTitle || null,
      browseTitle: browseTitle || null,
      editorsPickTitle: editorsPickTitle || null,
      testimonialsTitle: testimonialsTitle || null,
      sidebarCategoriesTitle: sidebarCategoriesTitle || null,
      sidebarTrendingTitle: sidebarTrendingTitle || null,
      newsletterTitle: newsletterTitle || null,
      newsletterDescription: newsletterDescription || null,
      newsletterPlaceholder: newsletterPlaceholder || null,
      newsletterButtonLabel: newsletterButtonLabel || null,
      ctaTitle: ctaTitle || null,
      ctaDescription: ctaDescription || null,
      ctaButtonLabel: ctaButtonLabel || null,
      ctaButtonHref: ctaButtonHref || null,
      phone: phone || null,
      email: email || null,
      address: address || null,
      hours: hours || null,
    };

    try {
      const res = await fetch("/api/admin/blog-page-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        if (json.errors) {
          setErrors(json.errors);
        } else {
          setGlobalError(json.message || "Failed to update settings");
        }
      } else {
        setSuccessMsg("Settings updated successfully!");
        setTimeout(() => setSuccessMsg(""), 5000);
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Connection issue.");
    } finally {
      setSaveLoading(false);
    }
  };

  const tabs = [
    { id: "hero", label: "Hero Settings" },
    { id: "labels", label: "Section Labels" },
    { id: "newsletter", label: "Newsletter Widget" },
    { id: "cta", label: "CTA & Coordinates" },
    { id: "seo", label: "SEO Configs" },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury text-left font-sans">
      
      {/* Sub tabs list */}
      <div className="flex border-b border-[var(--admin-border)] mb-6 overflow-x-auto pb-0.5 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 border-b-2 font-sans text-xs font-semibold tracking-wider transition-all whitespace-nowrap bg-transparent border-none cursor-pointer ${
              activeTab === tab.id
                ? "border-[var(--admin-accent)] text-[var(--admin-accent)] bg-[var(--admin-surface-hover)]"
                : "border-transparent text-[var(--admin-muted)] hover:text-[var(--admin-accent)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-xs text-[var(--admin-muted)] italic py-10 text-center">Loading settings data...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl p-4 font-semibold">
              {successMsg}
            </div>
          )}
          {globalError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-4 font-semibold">
              {globalError}
            </div>
          )}

          {/* TAB 1: Hero */}
          {activeTab === "hero" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Hero Eyebrow Text"
                  value={heroEyebrow}
                  onChange={(e) => setHeroEyebrow(e.target.value)}
                  placeholder="NAIL BEAUTY JOURNAL"
                />
                <FormField
                  label="Hero Highlight Tagline"
                  value={heroHighlight}
                  onChange={(e) => setHeroHighlight(e.target.value)}
                  placeholder="Beauty Stories"
                />
              </div>
              <FormField
                label="Hero Title Headline"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="Insights, Inspiration &"
              />
              <FormTextarea
                label="Hero Description copy"
                value={heroDescription}
                onChange={(e) => setHeroDescription(e.target.value)}
                placeholder="Intro summary about nail beauty stories..."
                rows={3}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[var(--admin-border)]/15 pt-4">
                <FormField
                  label="Primary Button Label"
                  value={primaryButtonLabel}
                  onChange={(e) => setPrimaryButtonLabel(e.target.value)}
                  placeholder="Explore Articles"
                />
                <FormField
                  label="Primary Button Href Link"
                  value={primaryButtonHref}
                  onChange={(e) => setPrimaryButtonHref(e.target.value)}
                  placeholder="#articles-list"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Secondary Button Label"
                  value={secondaryButtonLabel}
                  onChange={(e) => setSecondaryButtonLabel(e.target.value)}
                  placeholder="Subscribe Now"
                />
                <FormField
                  label="Secondary Button Href Link"
                  value={secondaryButtonHref}
                  onChange={(e) => setSecondaryButtonHref(e.target.value)}
                  placeholder="#newsletter-section"
                />
              </div>

              {/* Image config */}
              <div className="space-y-2 border-t border-[var(--admin-border)]/15 pt-4">
                <label className="block text-xs font-semibold text-[var(--admin-ink)] uppercase tracking-wider">Hero Banner image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    placeholder="No image chosen"
                    value={heroImage}
                    className="flex-grow rounded-xl border border-[var(--admin-border-strong)] px-3 py-2 text-xs outline-none bg-gray-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPicker(true)}
                    className="bg-[var(--admin-surface-muted)] hover:bg-[var(--admin-surface-hover)] text-[var(--admin-accent)] border border-[var(--admin-border)] px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon size={13} />
                    <span>Browse</span>
                  </button>
                </div>
                {heroImage && (
                  <div className="relative aspect-[16/9] max-w-[250px] rounded-xl overflow-hidden border">
                    <Image src={heroImage} alt="Hero Preview" fill className="object-cover" />
                  </div>
                )}
                <FormField
                  label="Hero Image Alt Text"
                  value={heroImageAlt}
                  onChange={(e) => setHeroImageAlt(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* TAB 2: Labels */}
          {activeTab === "labels" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Latest Section Header Label"
                value={latestTitle}
                onChange={(e) => setLatestTitle(e.target.value)}
                placeholder="Latest Articles"
              />
              <FormField
                label="Browse Section Header Label"
                value={browseTitle}
                onChange={(e) => setBrowseTitle(e.target.value)}
                placeholder="Browse by Category"
              />
              <FormField
                label="Curated picks Header Label"
                value={editorsPickTitle}
                onChange={(e) => setEditorsPickTitle(e.target.value)}
                placeholder="Editor's Picks"
              />
              <FormField
                label="Testimonials Section Header Label"
                value={testimonialsTitle}
                onChange={(e) => setTestimonialsTitle(e.target.value)}
                placeholder="What Our Readers Say"
              />
              <FormField
                label="Sidebar Popular Categories Header"
                value={sidebarCategoriesTitle}
                onChange={(e) => setSidebarCategoriesTitle(e.target.value)}
                placeholder="Popular Categories"
              />
              <FormField
                label="Sidebar Trending Posts Header"
                value={sidebarTrendingTitle}
                onChange={(e) => setSidebarTrendingTitle(e.target.value)}
                placeholder="Trending Posts"
              />
            </div>
          )}

          {/* TAB 3: Newsletter */}
          {activeTab === "newsletter" && (
            <div className="space-y-4">
              <FormField
                label="Newsletter Widget Title Headline"
                value={newsletterTitle}
                onChange={(e) => setNewsletterTitle(e.target.value)}
                placeholder="Get Beauty Stories Straight to Your Inbox"
              />
              <FormTextarea
                label="Newsletter Sub-Description description"
                value={newsletterDescription}
                onChange={(e) => setNewsletterDescription(e.target.value)}
                placeholder="Subscribe to our newsletter for tips, trends..."
                rows={2}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Email input field placeholder"
                  value={newsletterPlaceholder}
                  onChange={(e) => setNewsletterPlaceholder(e.target.value)}
                  placeholder="Enter your email"
                />
                <FormField
                  label="Subscribe Submit Button Label"
                  value={newsletterButtonLabel}
                  onChange={(e) => setNewsletterButtonLabel(e.target.value)}
                  placeholder="Subscribe Now"
                />
              </div>
            </div>
          )}

          {/* TAB 4: CTA coordinates */}
          {activeTab === "cta" && (
            <div className="space-y-4">
              <FormField
                label="Final CTA Headline"
                value={ctaTitle}
                onChange={(e) => setCtaTitle(e.target.value)}
                placeholder="Stay Inspired with Aera Nail Lounge"
              />
              <FormTextarea
                label="Final CTA Paragraph description"
                value={ctaDescription}
                onChange={(e) => setCtaDescription(e.target.value)}
                placeholder="Book your next appointment..."
                rows={2}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[var(--admin-border)]/15 pt-4">
                <FormField
                  label="CTA Button Label"
                  value={ctaButtonLabel}
                  onChange={(e) => setCtaButtonLabel(e.target.value)}
                  placeholder="Book Your Appointment"
                />
                <FormField
                  label="CTA Button Href Link"
                  value={ctaButtonHref}
                  onChange={(e) => setCtaButtonHref(e.target.value)}
                  placeholder="/booking"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-[var(--admin-border)]/15 pt-4">
                <FormField label="Contact Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <FormField label="Contact Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <FormField label="Location Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                <FormField label="Salon Hours" value={hours} onChange={(e) => setHours(e.target.value)} />
              </div>
            </div>
          )}

          {/* TAB 5: SEO metadata */}
          {activeTab === "seo" && (
            <div className="space-y-4">
              <FormField
                label="SEO page Title browser tag *"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Nail Beauty Journal | Aera Nail Lounge"
                error={errors.seoTitle?.[0]}
              />
              <FormTextarea
                label="SEO meta Description tag"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="Custom metadata index descriptions..."
                rows={3}
              />
            </div>
          )}

          {/* Submit Action */}
          <div className="flex justify-end pt-6 border-t border-[var(--admin-border)]/20">
            <button
              type="submit"
              disabled={saveLoading}
              className="bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white text-xs font-bold px-6 py-3 rounded-full cursor-pointer border-none shadow flex items-center gap-1.5"
            >
              <Save size={14} />
              <span>{saveLoading ? "Saving Settings..." : "Save Settings"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Media Library picker target dialog */}
      {showPicker && (
        <MediaPickerModal
          onSelect={handleMediaSelect}
          onClose={() => setShowPicker(false)}
        />
      )}

    </div>
  );
}
export default BlogSettingsForm;
