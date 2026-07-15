import type { MediaReference } from "./media.types";
import type { MediaAssetDto } from "./media-asset.dto";

export type MediaPickerValueMode = "url" | "reference";

export type MediaPickerAsset = Pick<
  MediaAssetDto,
  "id" | "fileName" | "originalName" | "url" | "alt" | "title"
>;

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
