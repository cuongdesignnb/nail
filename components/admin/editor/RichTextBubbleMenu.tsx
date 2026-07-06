'use client';

import type { Editor } from '@tiptap/react';
import { useEffect, useRef, useState, useCallback } from 'react';
import { BubbleMenuPlugin } from '@tiptap/extension-bubble-menu';
import { Bold, Italic, Link as LinkIcon } from 'lucide-react';
import { RichTextLinkDialog } from './RichTextLinkDialog';

interface RichTextBubbleMenuProps {
  editor: Editor;
}

export function RichTextBubbleMenu({ editor }: RichTextBubbleMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const iconSize = 14;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !menuRef.current || !editor?.view) return;

    const plugin = BubbleMenuPlugin({
      pluginKey: 'richTextBubbleMenu',
      editor,
      element: menuRef.current,
      updateDelay: 150,
      shouldShow: ({ editor: e, state }) => {
        const { from, to } = state.selection;
        // Only show when there's a text selection
        return from !== to && !e.isActive('image');
      },
    });

    editor.registerPlugin(plugin);

    return () => {
      editor.unregisterPlugin('richTextBubbleMenu');
    };
  }, [editor, mounted]);

  const currentLink = editor.getAttributes('link');

  if (!mounted) return null;

  return (
    <>
      <div
        ref={menuRef}
        className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white px-1 py-1 shadow-lg"
        style={{ visibility: 'hidden', position: 'absolute' }}
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
            editor.isActive('bold')
              ? 'bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]'
              : 'text-[var(--admin-muted)] hover:bg-[var(--admin-accent-soft)]'
          }`}
          title="Bold"
        >
          <Bold size={iconSize} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
            editor.isActive('italic')
              ? 'bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]'
              : 'text-[var(--admin-muted)] hover:bg-[var(--admin-accent-soft)]'
          }`}
          title="Italic"
        >
          <Italic size={iconSize} />
        </button>
        <button
          type="button"
          onClick={() => setLinkDialogOpen(true)}
          className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
            editor.isActive('link')
              ? 'bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]'
              : 'text-[var(--admin-muted)] hover:bg-[var(--admin-accent-soft)]'
          }`}
          title="Link"
        >
          <LinkIcon size={iconSize} />
        </button>
      </div>

      <RichTextLinkDialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        initialUrl={currentLink?.href || ''}
        initialNewTab={currentLink?.target === '_blank'}
        onSubmit={(url, openInNewTab) => {
          if (url) {
            editor
              .chain()
              .focus()
              .extendMarkRange('link')
              .setLink({
                href: url,
                target: openInNewTab ? '_blank' : null,
                rel: openInNewTab ? 'noopener noreferrer' : null,
              })
              .run();
          } else {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
          }
          setLinkDialogOpen(false);
        }}
      />
    </>
  );
}
