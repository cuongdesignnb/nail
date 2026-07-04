// ---------------------------------------------------------------------------
// Media type definitions
// ---------------------------------------------------------------------------

export interface UploadedMediaResult {
  id: string;
  url: string;
  storageKey: string;
  mimeType: 'image/webp';
  originalName: string;
  originalMimeType: string;
  width: number;
  height: number;
  size: number;
  alt: string;
  title: string;
  folderId: string | null;
}

export interface MediaUploadInput {
  buffer: Buffer;
  fileName: string;
  browserMimeType: string;
  folder?: string;
  alt?: string;
  title?: string;
  uploadedBy?: string;
}

export interface MediaFilterOptions {
  search?: string;
  folderId?: string | null;
  mimeType?: string;
  unused?: boolean;
  sortBy?: 'newest' | 'oldest' | 'name';
  page?: number;
  limit?: number;
}

export interface MediaUsageRef {
  entityType: string;
  entityId: string;
  fieldKey: string;
  label?: string;
}
