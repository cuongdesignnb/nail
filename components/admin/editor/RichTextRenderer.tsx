'use client';

import sanitize from 'sanitize-html';

interface RichTextRendererProps {
  html: string;
  className?: string;
}

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
  // Enforce rel on external links
  transformTags: {
    a: (tagName, attribs) => {
      if (attribs.target === '_blank') {
        attribs.rel = 'noopener noreferrer';
      }
      return { tagName, attribs };
    },
  },
};

function containsHtmlTags(str: string): boolean {
  return /<[a-z][\s\S]*>/i.test(str);
}

export function RichTextRenderer({ html, className = '' }: RichTextRendererProps) {
  if (!html) return null;

  // If the content doesn't contain HTML tags, wrap in <p>
  let content = html;
  if (!containsHtmlTags(content)) {
    content = `<p>${content}</p>`;
  }

  const clean = sanitize(content, sanitizeOptions);

  return (
    <div
      className={`rich-text-rendered ${className}`}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
