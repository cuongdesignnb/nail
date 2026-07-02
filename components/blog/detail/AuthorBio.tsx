"use client";
import React from "react";
import Image from "next/image";
import { User, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { BlogPostDTO } from "@/types/blog";

interface AuthorBioProps {
  post: BlogPostDTO;
}

export function AuthorBio({ post }: AuthorBioProps) {
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-left font-sans">
      <div className="bg-aera-cream/20 border border-aera-champagne/45 rounded-3xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        
        {/* Avatar */}
        {post.authorAvatar ? (
          <div className="relative w-16 h-16 rounded-full overflow-hidden border border-aera-champagne/60 shrink-0 shadow-sm">
            <Image src={post.authorAvatar} alt={post.authorName || "Author"} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-white border border-aera-champagne/60 flex items-center justify-center shrink-0 shadow-sm">
            <User size={28} className="text-aera-accent" />
          </div>
        )}

        {/* Content details */}
        <div className="flex-grow space-y-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold text-aera-accent uppercase tracking-widest block">Written By</span>
            <h4 className="font-heading text-sm font-normal text-aera-ink">
              {post.authorName || "Aera Team"}
            </h4>
            <p className="text-[10px] text-aera-muted">{post.authorRole || "Nail Care Specialist"}</p>
          </div>

          <p className="text-xs text-aera-muted leading-relaxed max-w-2xl">
            {post.seoDescription || "The Aera Team is dedicated to sharing expert nail care advice, trend insights, and beauty tips to help you look and feel your best—every day."}
          </p>

          <div className="flex items-center justify-center sm:justify-start gap-3 pt-2 border-t border-aera-champagne/10">
            <span className="text-[9px] font-semibold text-aera-muted uppercase tracking-wider">Connect with us</span>
            <div className="flex gap-2">
              <a href="https://facebook.com" className="text-gray-400 hover:text-aera-accent"><Facebook size={12} /></a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-aera-accent"><Instagram size={12} /></a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-aera-accent"><Twitter size={12} /></a>
              <a href="https://youtube.com" className="text-gray-400 hover:text-aera-accent"><Youtube size={12} /></a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
export default AuthorBio;
