import type { MediaReference } from "./media.types";

export type MediaPickerValueMode = "url" | "reference";

export type MediaPickerAsset = {
  id: string;
  fileName: string;
  originalName: string | null;
  url: string;
  alt: string | null;
  title: string | null;
};

export function mediaAssetToReference(
  asset: MediaPickerAsset,
  fallbackAlt = "",
): MediaReference {
  return {
    mediaId: asset.id,
    src: asset.url,
    alt:
      asset.alt ||
      asset.title ||
      asset.originalName ||
      asset.fileName ||
      fallbackAlt,
    title: asset.title || asset.originalName || asset.fileName,
  };
}

export function mediaAssetToPickerValue(
  asset: MediaPickerAsset,
  valueMode: MediaPickerValueMode,
  fallbackAlt = "",
): string | MediaReference {
  const reference = mediaAssetToReference(asset, fallbackAlt);
  return valueMode === "reference" ? reference : reference.src;
}
