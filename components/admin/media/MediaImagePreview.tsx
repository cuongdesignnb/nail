"use client";

import React from "react";
import Image from "next/image";
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  open: boolean;
  onClose: () => void;
}

export default function MediaImagePreview({
  url,
  alt,
  width,
  height,
  open,
  onClose,
}: Props) {
  const [zoom, setZoom] = React.useState(1);

  React.useEffect(() => {
    if (open) setZoom(1);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(z + 0.25, 4));
      if (e.key === "-") setZoom((z) => Math.max(z - 0.25, 0.25));
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.75)",
              zIndex: 100,
              backdropFilter: "blur(8px)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 101,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            {/* Controls */}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 16,
              }}
            >
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.25, 0.25))}
                style={ctrlBtnStyle}
                title="Zoom out"
              >
                <ZoomOut size={16} />
              </button>
              <span
                style={{
                  color: "white",
                  fontSize: 13,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 8px",
                }}
              >
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.25, 4))}
                style={ctrlBtnStyle}
                title="Zoom in"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => setZoom(1)}
                style={ctrlBtnStyle}
                title="Reset zoom"
              >
                <RotateCw size={16} />
              </button>
              <button onClick={onClose} style={ctrlBtnStyle} title="Close">
                <X size={16} />
              </button>
            </div>

            {/* Image */}
            <div
              style={{
                overflow: "auto",
                maxWidth: "90vw",
                maxHeight: "80vh",
                borderRadius: 12,
                background: "rgba(255, 255, 255, 0.05)",
              }}
            >
              <img
                src={url}
                alt={alt || "Preview"}
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: "transform 0.2s ease",
                  maxWidth: "none",
                  display: "block",
                }}
              />
            </div>

            {/* Info */}
            {(width || height) && (
              <div
                style={{
                  marginTop: 12,
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 12,
                }}
              >
                {width} × {height}px
                {alt && <span> · {alt}</span>}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const ctrlBtnStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 36,
  borderRadius: 10,
  background: "rgba(255, 255, 255, 0.12)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  color: "white",
  cursor: "pointer",
  transition: "all 0.15s",
};
