// ---------------------------------------------------------------------------
// Image validation — magic-byte detection & rules
// ---------------------------------------------------------------------------

/** Accepted source MIME types that will be converted to WebP */
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const;

/** Explicitly rejected types */
const REJECTED_EXTENSIONS = new Set([
  'svg', 'gif', 'heic', 'heif', 'tiff', 'tif',
  'pdf', 'exe', 'zip', 'rar', '7z', 'tar', 'gz',
]);

/** Max upload size in bytes (10 MB) */
export const MAX_UPLOAD_SIZE = 10 * 1024 * 1024;

/** Magic byte signatures for accepted image formats */
const MAGIC_BYTES: Array<{ type: string; bytes: number[]; offset?: number }> = [
  { type: 'image/jpeg', bytes: [0xFF, 0xD8, 0xFF] },
  { type: 'image/png', bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
  { type: 'image/webp', bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // RIFF
  { type: 'image/avif', bytes: [0x00, 0x00, 0x00], offset: 0 }, // ftyp box
];

export type ImageValidationResult =
  | { valid: true; detectedType: string }
  | { valid: false; error: string };

/**
 * Detect actual image type from buffer magic bytes.
 */
export function detectImageType(buffer: Buffer): string | null {
  for (const sig of MAGIC_BYTES) {
    const offset = sig.offset ?? 0;
    if (buffer.length < offset + sig.bytes.length) continue;
    const match = sig.bytes.every((b, i) => buffer[offset + i] === b);
    if (match) {
      // Special check for WebP: bytes 8-11 should be "WEBP"
      if (sig.type === 'image/webp') {
        if (buffer.length >= 12 && buffer.toString('ascii', 8, 12) === 'WEBP') {
          return 'image/webp';
        }
        continue;
      }
      // Special check for AVIF: look for "ftyp" at byte 4
      if (sig.type === 'image/avif') {
        if (buffer.length >= 12 && buffer.toString('ascii', 4, 8) === 'ftyp') {
          const brand = buffer.toString('ascii', 8, 12);
          if (['avif', 'avis', 'mif1'].includes(brand)) {
            return 'image/avif';
          }
        }
        continue;
      }
      return sig.type;
    }
  }
  return null;
}

/**
 * Validate an uploaded file before processing.
 */
export function validateUploadedImage(
  buffer: Buffer,
  fileName: string,
  browserMimeType: string,
): ImageValidationResult {
  // Check file size
  if (buffer.length > MAX_UPLOAD_SIZE) {
    return {
      valid: false,
      error: `File too large (${(buffer.length / 1024 / 1024).toFixed(1)}MB). Maximum is 10MB.`,
    };
  }

  if (buffer.length === 0) {
    return { valid: false, error: 'Empty file.' };
  }

  // Check rejected extensions
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  if (REJECTED_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `File type .${ext} is not supported. Please upload JPEG, PNG, WebP, or AVIF.`,
    };
  }

  // Detect actual type from magic bytes
  const detectedType = detectImageType(buffer);
  if (!detectedType) {
    return {
      valid: false,
      error: 'Could not detect image type. Please upload a valid JPEG, PNG, WebP, or AVIF file.',
    };
  }

  // Verify detected type is in accepted list
  if (!ACCEPTED_IMAGE_TYPES.includes(detectedType as any)) {
    return {
      valid: false,
      error: `Detected type ${detectedType} is not supported. Please upload JPEG, PNG, WebP, or AVIF.`,
    };
  }

  return { valid: true, detectedType };
}
