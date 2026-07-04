// ---------------------------------------------------------------------------
// Image processing — WebP auto-conversion using Sharp
// ---------------------------------------------------------------------------

import sharp from 'sharp';

export interface ProcessedImage {
  buffer: Buffer;
  width: number;
  height: number;
  size: number;
  format: 'webp';
}

export interface ProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  effort?: number;
}

const DEFAULTS: Required<ProcessingOptions> = {
  maxWidth: 2560,
  maxHeight: 2560,
  quality: 82,
  effort: 5,
};

/**
 * Convert any supported image buffer to optimised WebP.
 * - Auto-rotates from EXIF
 * - Strips metadata
 * - Resize to fit within max dimensions (no upscale)
 * - Preserves transparency (alpha channel)
 */
export async function optimizeToWebp(
  input: Buffer,
  opts?: ProcessingOptions,
): Promise<ProcessedImage> {
  const { maxWidth, maxHeight, quality, effort } = { ...DEFAULTS, ...opts };

  const processed = await sharp(input)
    .rotate() // auto-rotate based on EXIF
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({
      quality,
      effort,
      smartSubsample: true,
    })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: processed.data,
    width: processed.info.width,
    height: processed.info.height,
    size: processed.info.size,
    format: 'webp',
  };
}

/**
 * Get image metadata without full processing.
 */
export async function getImageMetadata(input: Buffer) {
  const meta = await sharp(input).metadata();
  return {
    width: meta.width ?? 0,
    height: meta.height ?? 0,
    format: meta.format ?? 'unknown',
    hasAlpha: meta.hasAlpha ?? false,
    size: input.length,
  };
}
