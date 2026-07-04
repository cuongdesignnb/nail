"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import type {
  ContentPageMeta,
  ContentRegistryItem,
  ContentPageKey,
} from "@/lib/content/content.types";
import { ContentHubHeader } from "./ContentHubHeader";
import { ContentPageGrid } from "./ContentPageGrid";
import { ContentHubSkeleton } from "./ContentHubSkeleton";
import { ContentHubErrorState } from "./ContentHubErrorState";

/* ------------------------------------------------------------------ */
/*  API Response Shape                                                */
/* ------------------------------------------------------------------ */

type ContentHubApiResponse = {
  success: boolean;
  data?: {
    pages: ContentPageMeta[];
    registry: Record<ContentPageKey, ContentRegistryItem>;
  };
  error?: string;
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function ContentHubPage() {
  const [pages, setPages] = useState<ContentPageMeta[]>([]);
  const [registry, setRegistry] = useState<Record<
    ContentPageKey,
    ContentRegistryItem
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/content", {
        cache: "no-store",
        headers: { "Cache-Control": "no-store" },
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const json: ContentHubApiResponse = await res.json();

      if (!json.success || !json.data) {
        throw new Error(json.error || "Failed to load content data");
      }

      setPages(json.data.pages);
      setRegistry(json.data.registry);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* Loading state */
  if (loading) {
    return <ContentHubSkeleton />;
  }

  /* Error state */
  if (error || !registry) {
    return <ContentHubErrorState message={error ?? undefined} onRetry={fetchData} />;
  }

  /* Success state */
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-[1400px]"
    >
      <ContentHubHeader />
      <ContentPageGrid pages={pages} registry={registry} />
    </motion.div>
  );
}
