"use client";

import Image from "next/image";

export function ImageField({ label, src, alt, onSrcChange, onAltChange }: { label: string; src: string; alt: string; onSrcChange: (value: string) => void; onAltChange: (value: string) => void }) {
  const safeSrc = src || "/aera-mark.svg";
  return (
    <div className="image-field">
      <label>{label} URL<input value={src} onChange={(event) => onSrcChange(event.target.value)} /></label>
      <label>{label} Alt<input value={alt} onChange={(event) => onAltChange(event.target.value)} /></label>
      <div className="image-preview">
        <Image src={safeSrc} alt={alt || label} fill sizes="220px" />
      </div>
    </div>
  );
}
