"use client";
import React, { useState, useEffect } from "react";
import { FormField, FormTextarea } from "@/components/common/FormField";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";

export function PackageSettingsForm() {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");

  // States
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

  const [benefitsEyebrow, setBenefitsEyebrow] = useState("");
  const [benefitsTitle, setBenefitsTitle] = useState("");
  const [benefitsDescription, setBenefitsDescription] = useState("");
  const [benefitsImage, setBenefitsImage] = useState("");
  const [benefitsImageAlt, setBenefitsImageAlt] = useState("");
  const [benefitsButtonLabel, setBenefitsButtonLabel] = useState("");
  const [benefitsButtonHref, setBenefitsButtonHref] = useState("");

  const [comparisonTitle, setComparisonTitle] = useState("");
  const [rewardsTitle, setRewardsTitle] = useState("");
  const [occasionsTitle, setOccasionsTitle] = useState("");
  const [processTitle, setProcessTitle] = useState("");
  const [testimonialsTitle, setTestimonialsTitle] = useState("");
  const [faqTitle, setFaqTitle] = useState("");

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
      const res = await fetch("/api/admin/package-page-settings");
      if (res.ok) {
        const json = await res.json();
        const data = json.data || {};
        setSeoTitle(data.seoTitle || "");
        setSeoDescription(data.seoDescription || "");
        setHeroEyebrow(data.heroEyebrow || "");
        setHeroTitle(data.heroTitle || "");
        setHeroHighlight(data.heroHighlight || "");
        setHeroDescription(data.heroDescription || "");
        setHeroImage(data.heroImage || "");
        setHeroImageAlt(data.heroImageAlt || "");
        setPrimaryButtonLabel(data.primaryButtonLabel || "");
        setPrimaryButtonHref(data.primaryButtonHref || "");
        setSecondaryButtonLabel(data.secondaryButtonLabel || "");
        setSecondaryButtonHref(data.secondaryButtonHref || "");
        setBenefitsEyebrow(data.benefitsEyebrow || "");
        setBenefitsTitle(data.benefitsTitle || "");
        setBenefitsDescription(data.benefitsDescription || "");
        setBenefitsImage(data.benefitsImage || "");
        setBenefitsImageAlt(data.benefitsImageAlt || "");
        setBenefitsButtonLabel(data.benefitsButtonLabel || "");
        setBenefitsButtonHref(data.benefitsButtonHref || "");
        setComparisonTitle(data.comparisonTitle || "");
        setRewardsTitle(data.rewardsTitle || "");
        setOccasionsTitle(data.occasionsTitle || "");
        setProcessTitle(data.processTitle || "");
        setTestimonialsTitle(data.testimonialsTitle || "");
        setFaqTitle(data.faqTitle || "");
        setCtaTitle(data.ctaTitle || "");
        setCtaDescription(data.ctaDescription || "");
        setCtaButtonLabel(data.ctaButtonLabel || "");
        setCtaButtonHref(data.ctaButtonHref || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setAddress(data.address || "");
        setHours(data.hours || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrors({});
    setGlobalError("");
    setSuccessMsg("");

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
      benefitsEyebrow: benefitsEyebrow || null,
      benefitsTitle: benefitsTitle || null,
      benefitsDescription: benefitsDescription || null,
      benefitsImage: benefitsImage || null,
      benefitsImageAlt: benefitsImageAlt || null,
      benefitsButtonLabel: benefitsButtonLabel || null,
      benefitsButtonHref: benefitsButtonHref || null,
      comparisonTitle: comparisonTitle || null,
      rewardsTitle: rewardsTitle || null,
      occasionsTitle: occasionsTitle || null,
      processTitle: processTitle || null,
      testimonialsTitle: testimonialsTitle || null,
      faqTitle: faqTitle || null,
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
      const res = await fetch("/api/admin/package-page-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        if (json.errors) {
          setErrors(json.errors);
        } else {
          setGlobalError(json.message || "Failed to save settings");
        }
      } else {
        setSuccessMsg("Packages page content settings saved successfully!");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Connection error occurred. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return <p className="text-xs text-[var(--admin-muted)] italic py-10 text-center">Loading page settings...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8 text-left font-sans pb-16">
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg p-4 font-semibold">
          {successMsg}
        </div>
      )}

      {globalError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-4 font-semibold">
          {globalError}
        </div>
      )}

      {/* SEO Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury">
        <h3 className="font-heading text-base font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
          SEO Configurations
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            label="SEO Page Title"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="e.g. Luxury Packages & Memberships | Aera Nail Lounge"
            error={errors.seoTitle?.[0]}
          />
          <FormTextarea
            label="SEO Meta Description"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="Search engine summary..."
            error={errors.seoDescription?.[0]}
            rows={2}
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury">
        <h3 className="font-heading text-base font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
          Hero Section Content
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Hero Eyebrow"
            value={heroEyebrow}
            onChange={(e) => setHeroEyebrow(e.target.value)}
            placeholder="e.g. LUXURY NAIL PACKAGES"
            error={errors.heroEyebrow?.[0]}
          />
          <FormField
            label="Hero Highlight"
            value={heroHighlight}
            onChange={(e) => setHeroHighlight(e.target.value)}
            placeholder="e.g. Pampering, Perfected"
            error={errors.heroHighlight?.[0]}
          />
        </div>
        <FormField
          label="Hero Title Text"
          value={heroTitle}
          onChange={(e) => setHeroTitle(e.target.value)}
          placeholder="e.g. Curated Packages for Every Beauty Ritual"
          error={errors.heroTitle?.[0]}
        />
        <FormTextarea
          label="Hero Description"
          value={heroDescription}
          onChange={(e) => setHeroDescription(e.target.value)}
          placeholder="Hero banner description..."
          error={errors.heroDescription?.[0]}
          rows={2}
        />
        <div className="mb-6">
          <MediaPickerField
            label="Hero Image"
            value={heroImage}
            onChange={(url) => setHeroImage(url)}
            alt={heroImageAlt}
            onAltChange={(altVal) => setHeroImageAlt(altVal)}
            folder="packages"
          />
          {errors.heroImage?.[0] && (
            <p className="mt-1 text-xs text-rose-500">{errors.heroImage[0]}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[var(--admin-border)] pt-4 mt-4">
          <FormField
            label="Primary Button Label"
            value={primaryButtonLabel}
            onChange={(e) => setPrimaryButtonLabel(e.target.value)}
            placeholder="Book Your Package"
            error={errors.primaryButtonLabel?.[0]}
          />
          <FormField
            label="Primary Button Href"
            value={primaryButtonHref}
            onChange={(e) => setPrimaryButtonHref(e.target.value)}
            placeholder="/booking"
            error={errors.primaryButtonHref?.[0]}
          />
          <FormField
            label="Secondary Button Label"
            value={secondaryButtonLabel}
            onChange={(e) => setSecondaryButtonLabel(e.target.value)}
            placeholder="Explore Benefits"
            error={errors.secondaryButtonLabel?.[0]}
          />
          <FormField
            label="Secondary Button Href"
            value={secondaryButtonHref}
            onChange={(e) => setSecondaryButtonHref(e.target.value)}
            placeholder="#benefits"
            error={errors.secondaryButtonHref?.[0]}
          />
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury">
        <h3 className="font-heading text-base font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
          Benefits / Why Choose Content
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Benefits Eyebrow"
            value={benefitsEyebrow}
            onChange={(e) => setBenefitsEyebrow(e.target.value)}
            placeholder="WHY CHOOSE OUR PACKAGES"
            error={errors.benefitsEyebrow?.[0]}
          />
          <FormField
            label="Benefits Title"
            value={benefitsTitle}
            onChange={(e) => setBenefitsTitle(e.target.value)}
            placeholder="Luxury, Value & Care"
            error={errors.benefitsTitle?.[0]}
          />
        </div>
        <FormTextarea
          label="Benefits Description"
          value={benefitsDescription}
          onChange={(e) => setBenefitsDescription(e.target.value)}
          placeholder="Benefits paragraph text..."
          error={errors.benefitsDescription?.[0]}
          rows={2}
        />
        <div className="mb-6">
          <MediaPickerField
            label="Benefits Image"
            value={benefitsImage}
            onChange={(url) => setBenefitsImage(url)}
            alt={benefitsImageAlt}
            onAltChange={(altVal) => setBenefitsImageAlt(altVal)}
            folder="packages"
          />
          {errors.benefitsImage?.[0] && (
            <p className="mt-1 text-xs text-rose-500">{errors.benefitsImage[0]}</p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--admin-border)]">
          <FormField
            label="Benefits Action Label"
            value={benefitsButtonLabel}
            onChange={(e) => setBenefitsButtonLabel(e.target.value)}
            placeholder="Learn More About Membership"
            error={errors.benefitsButtonLabel?.[0]}
          />
          <FormField
            label="Benefits Action Href"
            value={benefitsButtonHref}
            onChange={(e) => setBenefitsButtonHref(e.target.value)}
            placeholder="/about"
            error={errors.benefitsButtonHref?.[0]}
          />
        </div>
      </div>

      {/* Section Headings */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury">
        <h3 className="font-heading text-base font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
          Section Headings Override
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Comparison Title"
            value={comparisonTitle}
            onChange={(e) => setComparisonTitle(e.target.value)}
            placeholder="Compare Our Packages"
            error={errors.comparisonTitle?.[0]}
          />
          <FormField
            label="Rewards Section Title"
            value={rewardsTitle}
            onChange={(e) => setRewardsTitle(e.target.value)}
            placeholder="Membership & Rewards"
            error={errors.rewardsTitle?.[0]}
          />
          <FormField
            label="Occasions Title"
            value={occasionsTitle}
            onChange={(e) => setOccasionsTitle(e.target.value)}
            placeholder="Perfect For Every Occasion"
            error={errors.occasionsTitle?.[0]}
          />
          <FormField
            label="Process Step Title"
            value={processTitle}
            onChange={(e) => setProcessTitle(e.target.value)}
            placeholder="How It Works"
            error={errors.processTitle?.[0]}
          />
          <FormField
            label="Testimonials Title"
            value={testimonialsTitle}
            onChange={(e) => setTestimonialsTitle(e.target.value)}
            placeholder="What Clients Love"
            error={errors.testimonialsTitle?.[0]}
          />
          <FormField
            label="FAQ Section Title"
            value={faqTitle}
            onChange={(e) => setFaqTitle(e.target.value)}
            placeholder="Frequently Asked Questions"
            error={errors.faqTitle?.[0]}
          />
        </div>
      </div>

      {/* CTA / Contact block */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[var(--admin-border)]/45 shadow-luxury">
        <h3 className="font-heading text-base font-normal text-[var(--admin-ink)] mb-6 border-b border-[var(--admin-border-strong)] pb-3">
          Call to Action (CTA) & Contact details
        </h3>
        <FormField
          label="CTA Heading Title"
          value={ctaTitle}
          onChange={(e) => setCtaTitle(e.target.value)}
          placeholder="Ready to Find Your Perfect Package?"
          error={errors.ctaTitle?.[0]}
        />
        <FormTextarea
          label="CTA Description"
          value={ctaDescription}
          onChange={(e) => setCtaDescription(e.target.value)}
          placeholder="Let us pamper you..."
          error={errors.ctaDescription?.[0]}
          rows={2}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="CTA Button Label"
            value={ctaButtonLabel}
            onChange={(e) => setCtaButtonLabel(e.target.value)}
            placeholder="Book Your Appointment"
            error={errors.ctaButtonLabel?.[0]}
          />
          <FormField
            label="CTA Button Href"
            value={ctaButtonHref}
            onChange={(e) => setCtaButtonHref(e.target.value)}
            placeholder="/booking"
            error={errors.ctaButtonHref?.[0]}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[var(--admin-border)]">
          <FormField
            label="Contact Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(213) 555-1900"
            error={errors.phone?.[0]}
          />
          <FormField
            label="Contact Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hello@aeranailounge.com"
            error={errors.email?.[0]}
          />
          <FormField
            label="Contact Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Luxury Blvd, Suite 100, Los Angeles"
            error={errors.address?.[0]}
          />
          <FormField
            label="Opening Hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Mon – Sun: 10:00 AM – 8:00 PM"
            error={errors.hours?.[0]}
          />
        </div>
      </div>

      {/* Save Trigger button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saveLoading}
          className="bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] text-white text-xs font-bold px-6 py-3 rounded-full cursor-pointer border-none shadow-sm transition-all"
        >
          {saveLoading ? "Saving Changes..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}
export default PackageSettingsForm;
