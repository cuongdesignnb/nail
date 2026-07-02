export interface UploadResult {
  url: string;
  storageKey: string;
  provider: string;
  size: number;
  mimeType: string;
}

export interface StorageAdapter {
  upload(file: Buffer, filename: string, mimeType: string): Promise<UploadResult>;
  delete(storageKey: string): Promise<void>;
  getUrl(storageKey: string): string;
}
