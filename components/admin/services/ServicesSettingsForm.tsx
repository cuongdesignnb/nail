"use client";
import React, { useState, useEffect } from "react";
import { FormField, FormTextarea } from "@/components/common/FormField";

export function ServicesSettingsForm() {
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");

  // SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // Hero
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

  // Why Choose
  const [whyChooseTitle, setWhyChooseTitle] = useState("");
  const [whyChooseDescription, setWhyChooseDescription] = useState("");
  const [whyChooseImage, setWhyChooseImage] = useState("");

  // CTA
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaDescription, setCtaDescription] = useState("");
  const [ctaButtonLabel, setCtaButtonLabel] = useState("");
  const [ctaButtonHref, setCtaButtonHref] = useState("");

  // Contact
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
      const res = await fetch("/api/admin/services-page-settings");
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

        setWhyChooseTitle(data.whyChooseTitle || "");
        setWhyChooseDescription(data.whyChooseDescription || "");
        setWhyChooseImage(data.whyChooseImage || "");

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
      whyChooseTitle: whyChooseTitle || null,
      whyChooseDescription: whyChooseDescription || null,
      whyChooseImage: whyChooseImage || null,
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
      const res = await fetch("/api/admin/services-page-settings", {
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
        setSuccessMsg("Services page settings saved successfully!");
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
    return <p className="text-xs text-aera-muted italic py-10 text-center">Loading page settings...</p>;
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
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury">
        <h3 className="font-heading text-base font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
          SEO Configurations
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            label="SEO Page Title"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="e.g. Luxury Nail Services | Aera Nail Lounge"
            error={errors.seoTitle?.[0]}
          />
          <FormTextarea
            label="SEO Meta Description"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="Search engine page summary..."
            error={errors.seoDescription?.[0]}
            rows={2}
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury">
        <h3 className="font-heading text-base font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
          Hero Banner
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Hero Eyebrow"
            value={heroEyebrow}
            onChange={(e) => setHeroEyebrow(e.target.value)}
            placeholder="e.g. LUXURY NAIL SERVICES"
            error={errors.heroEyebrow?.[0]}
          />
          <FormField
            label="Hero Highlight Title"
            value={heroHighlight}
            onChange={(e) => setHeroHighlight(e.target.value)}
            placeholder="e.g. Every Nail Style"
            error={errors.heroHighlight?.[0]}
          />
        </div>
        <FormField
          label="Hero Title Text"
          value={heroTitle}
          onChange={(e) => setHeroTitle(e.target.value)}
          placeholder="e.g. Exceptional Care for"
          error={errors.heroTitle?.[0]}
        />
        <FormTextarea
          label="Hero Subtitle / Description"
          value={heroDescription}
          onChange={(e) => setHeroDescription(e.target.value)}
          placeholder="Hero banner description..."
          error={errors.heroDescription?.[0]}
          rows={2}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Hero Image Path / URL"
            value={heroImage}
            onChange={(e) => setHeroImage(e.target.value)}
            placeholder="e.g. /images/about-hero-nail.jpg"
            error={errors.heroImage?.[0]}
          />
          <FormField
            label="Hero Image Alt Text"
            value={heroImageAlt}
            onChange={(e) => setHeroImageAlt(e.target.value)}
            placeholder="e.g. Beautiful luxury manicure nails"
            error={errors.heroImageAlt?.[0]}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-aera-champagne/30 pt-4 mt-4">
          <FormField
            label="Primary Button Text"
            value={primaryButtonLabel}
            onChange={(e) => setPrimaryButtonLabel(e.target.value)}
            placeholder="e.g. Book Your Appointment"
            error={errors.primaryButtonLabel?.[0]}
          />
          <FormField
            label="Primary Button Href"
            value={primaryButtonHref}
            onChange={(e) => setPrimaryButtonHref(e.target.value)}
            placeholder="e.g. /booking"
            error={errors.primaryButtonHref?.[0]}
          />
          <FormField
            label="Secondary Button Text"
            value={secondaryButtonLabel}
            onChange={(e) => setSecondaryButtonLabel(e.target.value)}
            placeholder="e.g. View Packages"
            error={errors.secondaryButtonLabel?.[0]}
          />
          <FormField
            label="Secondary Button Href"
            value={secondaryButtonHref}
            onChange={(e) => setSecondaryButtonHref(e.target.value)}
            placeholder="e.g. /packages"
            error={errors.secondaryButtonHref?.[0]}
          />
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury">
        <h3 className="font-heading text-base font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
          Why Choose Us Section
        </h3>
        <FormField
          label="Why Choose Title"
          value={whyChooseTitle}
          onChange={(e) => setWhyChooseTitle(e.target.value)}
          placeholder="e.g. Beauty, Hygiene & Precision in Every Service"
          error={errors.whyChooseTitle?.[0]}
        />
        <FormTextarea
          label="Why Choose Description"
          value={whyChooseDescription}
          onChange={(e) => setWhyChooseDescription(e.target.value)}
          placeholder="Subheading / paragraph text..."
          error={errors.whyChooseDescription?.[0]}
          rows={3}
        />
        <FormField
          label="Why Choose Collaged Image URL"
          value={whyChooseImage}
          onChange={(e) => setWhyChooseImage(e.target.value)}
          placeholder="/images/about-salon.jpg"
          error={errors.whyChooseImage?.[0]}
        />
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-aera-champagne/45 shadow-luxury">
        <h3 className="font-heading text-base font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
          Call To Action & Contact Card
        </h3>
        <FormField
          label="CTA Box Title"
          value={ctaTitle}
          onChange={(e) => setCtaTitle(e.target.value)}
          placeholder="e.g. Ready for Your Perfect Nail Experience?"
          error={errors.ctaTitle?.[0]}
        />
        <FormTextarea
          label="CTA Box Description"
          value={ctaDescription}
          onChange={(e) => setCtaDescription(e.target.value)}
          placeholder="e.g. Treat yourself to the elegance, comfort..."
          error={errors.ctaDescription?.[0]}
          rows={2}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="CTA Button Label"
            value={ctaButtonLabel}
            onChange={(e) => setCtaButtonLabel(e.target.value)}
            placeholder="e.g. Book Your Appointment"
            error={errors.ctaButtonLabel?.[0]}
          />
          <FormField
            label="CTA Button Href"
            value={ctaButtonHref}
            onChange={(e) => setCtaButtonHref(e.target.value)}
            placeholder="e.g. /booking"
            error={errors.ctaButtonHref?.[0]}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-aera-champagne/30 pt-4 mt-4">
          <FormField
            label="Contact Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(626) 555-7800"
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
            label="Salon Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Luxe Ave, Los Angeles, CA 90001"
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

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="submit"
          disabled={saveLoading}
          className="bg-aera-accent hover:bg-aera-accentHover text-white rounded-full px-8 py-3 text-sm font-semibold cursor-pointer border-none shadow-md"
        >
          {saveLoading ? "Saving Settings..." : "Save Page Configurations"}
        </button>
      </div>
    </form>
  );
}
export default ServicesSettingsForm;
