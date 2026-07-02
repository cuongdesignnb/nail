import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { StorageAdapter, UploadResult } from "./storage.types";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export class LocalStorageAdapter implements StorageAdapter {
  async upload(file: Buffer, filename: string, mimeType: string): Promise<UploadResult> {
    await mkdir(UPLOAD_DIR, { recursive: true });

    const ext = path.extname(filename) || this.mimeToExt(mimeType);
    const uniqueName = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);

    await writeFile(filePath, file);

    return {
      url: `/uploads/${uniqueName}`,
      storageKey: uniqueName,
      provider: "local",
      size: file.length,
      mimeType,
    };
  }

  async delete(storageKey: string): Promise<void> {
    const filePath = path.join(UPLOAD_DIR, storageKey);
    try {
      await unlink(filePath);
    } catch (err: unknown) {
      if (err instanceof Error && "code" in err && (err as NodeJS.ErrnoException).code !== "ENOENT") {
        throw err;
      }
      // File already gone — not an error
    }
  }

  getUrl(storageKey: string): string {
    return `/uploads/${storageKey}`;
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
