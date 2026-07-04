"use client";

import React from "react";
import { Trash2, Download, FolderInput, X } from "lucide-react";

interface Props {
  selectedCount: number;
  onDelete: () => void;
  onMove?: () => void;
  onDownload?: () => void;
  onClear: () => void;
}

export default function MediaSelectionToolbar({
  selectedCount,
  onDelete,
  onMove,
  onDownload,
  onClear,
}: Props) {
  if (selectedCount === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 20px",
        background: "linear-gradient(135deg, rgba(168, 93, 30, 0.06), rgba(196, 128, 62, 0.04))",
        borderRadius: 12,
        border: "1px solid rgba(168, 93, 30, 0.12)",
        marginBottom: 16,
      }}
    >
      <span
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#a85d1e",
          minWidth: 120,
        }}
      >
        {selectedCount} selected
      </span>

      <div style={{ display: "flex", gap: 8 }}>
        {onMove && (
          <button
            onClick={onMove}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 14px",
              background: "white",
              border: "1px solid rgba(116, 55, 15, 0.15)",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: "#4a2d1e",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            <FolderInput size={14} />
            Move
          </button>
        )}

        {onDownload && (
          <button
            onClick={onDownload}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "6px 14px",
              background: "white",
              border: "1px solid rgba(116, 55, 15, 0.15)",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: "#4a2d1e",
              cursor: "pointer",
            }}
          >
            <Download size={14} />
            Download
          </button>
        )}

        <button
          onClick={onDelete}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "6px 14px",
            background: "rgba(220, 38, 38, 0.06)",
            border: "1px solid rgba(220, 38, 38, 0.15)",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            color: "#dc2626",
            cursor: "pointer",
          }}
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={onClear}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          padding: "6px 10px",
          background: "transparent",
          border: "none",
          fontSize: 12,
          color: "#7f6d61",
          cursor: "pointer",
        }}
      >
        <X size={14} />
        Clear
      </button>
    </div>
  );
}
