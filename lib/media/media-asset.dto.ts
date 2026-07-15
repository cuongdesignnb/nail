import type { MediaAsset } from "@prisma/client";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

export type MediaAssetDto = {
  id: string;
  fileName: string;
  originalName: string | null;
  url: string;
  storageKey: string;
  mimeType: string | null;
  originalMimeType?: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  alt: string | null;
  title: string | null;
  folder: string | null;
  folderId?: string | null;
  provider?: string | null;
  createdAt: string;
};

export function serializeMediaAsset(asset: MediaAsset): MediaAssetDto {
  return {
    id: asset.id,
    fileName: asset.fileName,
    originalName: asset.originalName,
    url: normalizeMediaUrl(asset.url),
    storageKey: asset.storageKey || asset.fileName,
    mimeType: asset.mimeType,
    originalMimeType: asset.originalMimeType,
    size: asset.size,
    width: asset.width,
    height: asset.height,
    alt: asset.alt,
    title: asset.title,
    folder: asset.folder,
    folderId: asset.folderId,
    provider: asset.provider,
    createdAt: asset.createdAt.toISOString(),
  };
}
