export interface UploadResult {
  url: string;
  storageKey: string;
  provider: string;
  size: number;
  mimeType: string;
}

export interface StorageAdapter {
  upload(file: Buffer, storageKey: string, mimeType: string): Promise<UploadResult>;
  delete(storageKey: string): Promise<void>;
  exists(storageKey: string): Promise<boolean>;
  getUrl(storageKey: string): string;
}
