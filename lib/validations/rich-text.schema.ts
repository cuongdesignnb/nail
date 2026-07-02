import sanitize from 'sanitize-html';
import { z } from 'zod';

const sanitizeOptions: sanitize.IOptions = {
  allowedTags: [
    'p', 'br', 'strong', 'em', 'u', 's', 'h2', 'h3',
    'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'span',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height'],
    '*': ['class', 'style'],
  },
  disallowedTagsMode: 'discard',
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: (tagName, attribs) => {
      if (attribs.target === '_blank') {
        attribs.rel = 'noopener noreferrer';
      }
      return { tagName, attribs };
    },
  },
};

/**
 * Server-side HTML sanitization using the same config as the client renderer.
 * Use this before storing rich text content in the database.
 */
export function sanitizeRichText(html: string): string {
  if (!html) return '';
  return sanitize(html, sanitizeOptions);
}

/**
 * Zod schema that sanitizes HTML input via transform.
 * Usage: richTextSchema.parse(userInput)
 */
export const richTextSchema = z
  .string()
  .transform((val) => sanitizeRichText(val));

/**
 * Optional rich text schema (allows empty / undefined).
 */
export const optionalRichTextSchema = z
  .string()
  .optional()
  .transform((val) => (val ? sanitizeRichText(val) : val));
