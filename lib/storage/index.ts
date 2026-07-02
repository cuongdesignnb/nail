import { StorageAdapter } from "./storage.types";
import { LocalStorageAdapter } from "./local-storage.adapter";
import { R2StorageAdapter } from "./r2-storage.adapter";

let _adapter: StorageAdapter | null = null;

export function getStorageAdapter(): StorageAdapter {
  if (_adapter) return _adapter;

  const provider = process.env.STORAGE_PROVIDER || "local";

  switch (provider) {
    case "r2":
      _adapter = new R2StorageAdapter();
      break;
    case "local":
    default:
      _adapter = new LocalStorageAdapter();
      break;
  }

  return _adapter;
}

export type { StorageAdapter, UploadResult } from "./storage.types";
