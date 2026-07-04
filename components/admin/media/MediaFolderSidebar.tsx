"use client";

import React from "react";
import { Folder, ChevronRight } from "lucide-react";

interface MediaFolder {
  id: string;
  name: string;
  slug: string;
  _count?: { assets: number };
}

interface Props {
  folders: MediaFolder[];
  activeFolder: string | null;
  onSelect: (folderId: string | null) => void;
  loading?: boolean;
}

export default function MediaFolderSidebar({
  folders,
  activeFolder,
  onSelect,
  loading,
}: Props) {
  return (
    <div
      style={{
        width: 220,
        minWidth: 220,
        borderRight: "1px solid rgba(116, 55, 15, 0.08)",
        background: "#fffdf9",
        padding: "16px 0",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <div
        style={{
          padding: "0 16px 12px",
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: 1.4,
          textTransform: "uppercase" as const,
          color: "#7f6d61",
        }}
      >
        Folders
      </div>

      {/* All Media */}
      <button
        onClick={() => onSelect(null)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 16px",
          background: activeFolder === null ? "rgba(168, 93, 30, 0.08)" : "transparent",
          color: activeFolder === null ? "#a85d1e" : "#4a2d1e",
          border: "none",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: activeFolder === null ? 700 : 500,
          width: "100%",
          textAlign: "left" as const,
          borderLeft: activeFolder === null ? "3px solid #a85d1e" : "3px solid transparent",
          transition: "all 0.15s",
        }}
      >
        <Folder size={15} />
        <span>All Media</span>
      </button>

      {/* Folder list */}
      {loading ? (
        <div style={{ padding: "12px 16px", color: "#7f6d61", fontSize: 12 }}>Loading...</div>
      ) : (
        folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => onSelect(folder.id)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              padding: "8px 16px",
              background: activeFolder === folder.id ? "rgba(168, 93, 30, 0.08)" : "transparent",
              color: activeFolder === folder.id ? "#a85d1e" : "#4a2d1e",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: activeFolder === folder.id ? 700 : 500,
              width: "100%",
              textAlign: "left" as const,
              borderLeft:
                activeFolder === folder.id ? "3px solid #a85d1e" : "3px solid transparent",
              transition: "all 0.15s",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Folder size={15} />
              <span>{folder.name}</span>
            </span>
            {folder._count?.assets !== undefined && (
              <span
                style={{
                  fontSize: 11,
                  color: "#7f6d61",
                  background: "rgba(116, 55, 15, 0.06)",
                  borderRadius: 6,
                  padding: "2px 6px",
                }}
              >
                {folder._count.assets}
              </span>
            )}
          </button>
        ))
      )}
    </div>
  );
}
