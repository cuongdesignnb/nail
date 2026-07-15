import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import path from "path";
import { StorageAdapter, UploadResult } from "./storage.types";

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env variable: ${key}`);
  return value;
}

export class R2StorageAdapter implements StorageAdapter {
  private client: S3Client;
  private bucket: string;
  private publicUrl: string;

  constructor() {
    const accountId = getEnv("R2_ACCOUNT_ID");
    this.bucket = getEnv("R2_BUCKET_NAME");
    this.publicUrl = getEnv("R2_PUBLIC_URL").replace(/\/$/, "");

    this.client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: getEnv("R2_ACCESS_KEY_ID"),
        secretAccessKey: getEnv("R2_SECRET_ACCESS_KEY"),
      },
    });
  }

  async upload(file: Buffer, requestedKey: string, mimeType: string): Promise<UploadResult> {
    const normalized = requestedKey.replace(/\\/g, "/").replace(/^\/+/, "");
    if (!normalized || normalized.split("/").includes("..")) {
      throw new Error("Invalid storage key.");
    }
    const ext = path.posix.extname(normalized) || this.mimeToExt(mimeType);
    const storageKey = path.posix.extname(normalized) ? normalized : `${normalized}${ext}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
        Body: file,
        ContentType: mimeType,
      })
    );

    return {
      url: `${this.publicUrl}/${storageKey}`,
      storageKey,
      provider: "r2",
      size: file.length,
      mimeType,
    };
  }

  async delete(storageKey: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: storageKey,
      })
    );
  }

  async exists(storageKey: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: storageKey,
        })
      );
      return true;
    } catch (error) {
      const status = (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode;
      const name = (error as { name?: string }).name;
      if (status === 404 || name === "NotFound" || name === "NoSuchKey") return false;
      throw error;
    }
  }

  getUrl(storageKey: string): string {
    return `${this.publicUrl}/${storageKey}`;
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
