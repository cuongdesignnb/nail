'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { useEffect, useRef } from 'react';
import { RichTextToolbar } from './RichTextToolbar';
import { RichTextBubbleMenu } from './RichTextBubbleMenu';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing...',
  minHeight = '200px',
}: RichTextEditorProps) {
  const isUpdatingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-aera-accent underline',
        },
      }),
      Image,
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'rich-text-editor-content outline-none',
        style: `min-height: ${minHeight}`,
      },
    },
    onUpdate: ({ editor }) => {
      isUpdatingRef.current = true;
      onChange(editor.getHTML());
      // Reset flag after a tick to allow external updates
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    },
  });

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    if (!editor || isUpdatingRef.current) return;

    const currentContent = editor.getHTML();
    // Normalize empty content comparisons
    const normalizedCurrent = currentContent === '<p></p>' ? '' : currentContent;
    const normalizedValue = value === '<p></p>' ? '' : (value || '');

    if (normalizedCurrent !== normalizedValue) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white transition-colors focus-within:border-aera-accent">
      <RichTextToolbar editor={editor} />
      <RichTextBubbleMenu editor={editor} />
      <div className="px-4 py-3">
        <EditorContent editor={editor} />
      </div>

      {/* Editor content styles */}
      <style jsx global>{`
        .rich-text-editor-content {
          font-family: var(--font-inter), sans-serif;
          color: #3D2417;
          font-size: 0.9375rem;
          line-height: 1.7;
        }
        .rich-text-editor-content h2 {
          font-family: var(--font-playfair), serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 1.25rem 0 0.5rem;
          color: #3D2417;
        }
        .rich-text-editor-content h3 {
          font-family: var(--font-playfair), serif;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
          color: #3D2417;
        }
        .rich-text-editor-content p {
          margin: 0.5rem 0;
        }
        .rich-text-editor-content ul,
        .rich-text-editor-content ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .rich-text-editor-content ul {
          list-style: disc;
        }
        .rich-text-editor-content ol {
          list-style: decimal;
        }
        .rich-text-editor-content li {
          margin: 0.25rem 0;
        }
        .rich-text-editor-content blockquote {
          border-left: 3px solid #A7622A;
          padding-left: 1rem;
          margin: 0.75rem 0;
          color: #74665A;
          font-style: italic;
        }
        .rich-text-editor-content a {
          color: #A7622A;
          text-decoration: underline;
        }
        .rich-text-editor-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 0.75rem 0;
        }
        .rich-text-editor-content hr {
          border: none;
          border-top: 1px solid #F8EEE3;
          margin: 1rem 0;
        }
        .rich-text-editor-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #74665A;
          opacity: 0.5;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
