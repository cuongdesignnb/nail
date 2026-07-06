'use client';

import type { Editor } from '@tiptap/react';
import { useState } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  ImageIcon,
  RemoveFormatting,
  Undo2,
  Redo2,
} from 'lucide-react';
import { RichTextLinkDialog } from './RichTextLinkDialog';
import { MediaPickerDialog } from '@/components/admin/media/MediaPickerDialog';

interface RichTextToolbarProps {
  editor: Editor;
}

function ToolbarButton({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        flex h-8 w-8 items-center justify-center rounded-lg transition-colors border-none bg-transparent
        ${active ? 'bg-[var(--admin-border-muted)] text-[var(--admin-accent)] font-bold' : 'text-[var(--admin-muted)] hover:bg-[var(--admin-surface-hover)]0 hover:text-[var(--admin-ink)]'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-6 w-px bg-gray-200" />;
}

export function RichTextToolbar({ editor }: RichTextToolbarProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const iconSize = 16;

  // Get current link info for editing
  const currentLink = editor.getAttributes('link');

  const charCount = editor.storage.characterCount?.characters?.() ?? editor.getText().length;

  return (
    <>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-[var(--admin-border)]/45 bg-[var(--admin-surface-hover)] px-2 py-1.5">
        {/* Text type */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive('paragraph') && !editor.isActive('heading')}
          title="Paragraph"
        >
          <Pilcrow size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Format */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough"
        >
          <Strikethrough size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet list"
        >
          <List size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Ordered list"
        >
          <ListOrdered size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align left"
        >
          <AlignLeft size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align center"
        >
          <AlignCenter size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align right"
        >
          <AlignRight size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Insert */}
        <ToolbarButton
          onClick={() => setLinkDialogOpen(true)}
          active={editor.isActive('link')}
          title="Insert link"
        >
          <LinkIcon size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setImageDialogOpen(true)}
          title="Insert image"
        >
          <ImageIcon size={iconSize} />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Actions */}
        <ToolbarButton
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          title="Clear formatting"
        >
          <RemoveFormatting size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo2 size={iconSize} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo2 size={iconSize} />
        </ToolbarButton>

        {/* Character count */}
        <div className="ml-auto text-xs text-[var(--admin-muted)] tabular-nums">
          {charCount} chars
        </div>
      </div>

      {/* Dialogs */}
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
      <MediaPickerDialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        onSelect={(asset) => {
          const selectedAsset = Array.isArray(asset) ? asset[0] : asset;
          if (selectedAsset?.url) {
            editor
              .chain()
              .focus()
              .setImage({
                src: selectedAsset.url,
                alt: selectedAsset.alt || selectedAsset.originalName || 'Image',
              })
              .run();
          }
        }}
      />
    </>
  );
}
