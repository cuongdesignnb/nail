import { access, mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import type { StorageAdapter, UploadResult } from "./storage.types";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export class LocalStorageAdapter implements StorageAdapter {
  async upload(file: Buffer, requestedKey: string, mimeType: string): Promise<UploadResult> {
    const storageKey = this.normalizeStorageKey(requestedKey, mimeType);
    const filePath = this.resolveStoragePath(storageKey);

    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, file);

    return {
      url: this.getUrl(storageKey),
      storageKey,
      provider: "local",
      size: file.length,
      mimeType,
    };
  }

  async delete(storageKey: string): Promise<void> {
    try {
      await unlink(this.resolveStoragePath(storageKey));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }

  async exists(storageKey: string): Promise<boolean> {
    try {
      await access(this.resolveStoragePath(storageKey));
      return true;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return false;
      throw error;
    }
  }

  getUrl(storageKey: string): string {
    return `/uploads/${storageKey.replace(/\\/g, "/")}`;
  }

  private normalizeStorageKey(requestedKey: string, mimeType: string): string {
    const normalized = requestedKey.replace(/\\/g, "/").replace(/^\/+/, "");
    const parsed = path.posix.parse(normalized);
    const fileName = parsed.ext
      ? parsed.base
      : `${parsed.name || crypto.randomUUID()}${this.mimeToExt(mimeType)}`;
    return path.posix.join(parsed.dir, fileName);
  }

  private resolveStoragePath(storageKey: string): string {
    const normalized = storageKey.replace(/\\/g, "/").replace(/^\/+/, "");
    if (!normalized || normalized.split("/").includes("..")) {
      throw new Error("Invalid storage key.");
    }

    const resolvedRoot = path.resolve(UPLOAD_DIR);
    const resolvedPath = path.resolve(resolvedRoot, ...normalized.split("/"));
    if (resolvedPath !== resolvedRoot && !resolvedPath.startsWith(`${resolvedRoot}${path.sep}`)) {
      throw new Error("Storage key resolves outside the upload directory.");
    }
    return resolvedPath;
  }

  private mimeToExt(mimeType: string): string {
    const map: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
      "image/avif": ".avif",
    };
    return map[mimeType] || ".bin";
  }
}
