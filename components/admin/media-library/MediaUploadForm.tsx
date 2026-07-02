"use client";
import React, { useState } from "react";
import { FormField } from "@/components/common/FormField";
import { Plus, Save } from "lucide-react";

interface MediaUploadFormProps {
  onSuccess: () => void;
}

export function MediaUploadForm({ onSuccess }: MediaUploadFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");

  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [title, setTitle] = useState("");
  const [folder, setFolder] = useState("uploads");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setErrors({});
    setGlobalError("");

    try {
      const fileName = url.split("/").pop() || "image.jpg";
      const payload = {
        fileName,
        url,
        alt: alt || fileName,
        title: title || fileName,
        folder,
      };

      const res = await fetch("/api/admin/media-library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        if (json.errors) {
          setErrors(json.errors);
        } else {
          setGlobalError(json.message || "Failed to register asset");
        }
      } else {
        setUrl("");
        setAlt("");
        setTitle("");
        setFolder("uploads");
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Connection issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-aera-champagne/45 shadow-luxury text-left font-sans max-w-xl mx-auto">
      <h3 className="font-heading text-base font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3 flex items-center gap-1.5">
        <Plus size={16} className="text-aera-accent" />
        <span>Register New Media URL</span>
      </h3>

      {globalError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-4 mb-4 font-semibold">
          {globalError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Direct Image URL / Path *"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="e.g. /images/blog-1.jpg"
          error={errors.url?.[0]}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Alt Text Description"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="e.g. Lavender manicure detailing"
            error={errors.alt?.[0]}
          />
          <FormField
            label="Title Description"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Lavender Nails"
            error={errors.title?.[0]}
          />
        </div>
        <FormField
          label="Target Folder"
          value={folder}
          onChange={(e) => setFolder(e.target.value)}
          placeholder="e.g. uploads"
          error={errors.folder?.[0]}
        />

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="bg-aera-accent hover:bg-aera-accentHover text-white text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer border-none shadow-sm flex items-center gap-1.5"
          >
            <Save size={13} />
            <span>{loading ? "Registering..." : "Add to Library"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
export default MediaUploadForm;
