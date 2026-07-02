export type MediaAssetDTO = {
  id: string;
  fileName: string;
  originalName?: string | null;
  url: string;
  mimeType?: string | null;
  size?: number | null;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
  title?: string | null;
  folder?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
