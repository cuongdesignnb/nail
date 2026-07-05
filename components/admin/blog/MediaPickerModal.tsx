"use client";

import { MediaPickerDialog } from "@/components/admin/media/MediaPickerDialog";

interface MediaAsset {
  id: string;
  fileName: string;
  url: string;
  alt: string | null;
  title: string | null;
}

interface MediaPickerModalProps {
  onSelect: (url: string, alt: string) => void;
  onClose: () => void;
}

export function MediaPickerModal({ onSelect, onClose }: MediaPickerModalProps) {
  const handleSelect = (assetOrAssets: MediaAsset | MediaAsset[]) => {
    const asset = Array.isArray(assetOrAssets) ? assetOrAssets[0] : assetOrAssets;
    if (!asset) return;
    onSelect(asset.url, asset.alt || asset.title || asset.fileName || "");
  };

  return (
    <MediaPickerDialog
      open
      onClose={onClose}
      onSelect={handleSelect}
      title="Select from Media Library"
    />
  );
}

export default MediaPickerModal;
