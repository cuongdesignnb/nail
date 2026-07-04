"use client";
import React from "react";
import { AdminGalleryNavTabs } from "@/components/admin/gallery/AdminGalleryNavTabs";
import { GalleryTestimonialForm } from "@/components/admin/gallery/GalleryTestimonialForm";
import { Star } from "lucide-react";

export default function AdminTestimonialsPage() {
  return (
    <div className="admin-page font-sans text-left p-6">
      {/* Header */}
      <section className="admin-section-heading mb-6">
        <h1 className="text-2xl font-bold text-aera-ink flex items-center gap-2 font-heading leading-snug mb-1.5">
          <Star size={24} className="text-aera-accent" />
          Client Testimonials
        </h1>
        <p className="text-xs text-aera-muted">
          Manage client quotes and ratings showing at the bottom of the gallery page.
        </p>
      </section>

      {/* Tabs */}
      <AdminGalleryNavTabs />

      {/* Content */}
      <div className="mt-4">
        <GalleryTestimonialForm />
      </div>
    </div>
  );
}
