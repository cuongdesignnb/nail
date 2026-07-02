'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { SeoPageList } from '@/components/admin/seo/SeoPageList';
import { SeoEditorPanel } from '@/components/admin/seo/SeoEditorPanel';

const SEO_PAGES = [
  { scopeKey: 'home', pageKey: 'home', label: 'Home', path: '/' },
  { scopeKey: 'about', pageKey: 'about', label: 'About', path: '/about' },
  { scopeKey: 'services', pageKey: 'services', label: 'Services', path: '/services' },
  { scopeKey: 'gallery', pageKey: 'gallery', label: 'Gallery', path: '/gallery' },
  { scopeKey: 'packages', pageKey: 'packages', label: 'Packages', path: '/packages' },
  { scopeKey: 'blog', pageKey: 'blog', label: 'Blog', path: '/blog' },
  { scopeKey: 'promotions', pageKey: 'promotions', label: 'Promotions', path: '/promotions' },
  { scopeKey: 'contact', pageKey: 'contact', label: 'Contact', path: '/contact' },
];

interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: string;
  schemaJson?: string;
}

export default function SeoManagerPage() {
  const [selectedKey, setSelectedKey] = useState('home');
  const [seoData, setSeoData] = useState<SeoData | null>(null);
  const [configuredKeys, setConfiguredKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Fetch all SEO records on mount to determine configured keys
  useEffect(() => {
    async function fetchAll() {
      try {
        const res = await fetch('/api/admin/seo');
        const json = await res.json();
        if (json.success && json.data) {
          const keys = new Set<string>(
            json.data.map((r: { scopeKey: string }) => r.scopeKey)
          );
          setConfiguredKeys(keys);
        }
      } catch (err) {
        console.error('Failed to fetch SEO records:', err);
      }
    }
    fetchAll();
  }, []);

  // Fetch SEO data for selected page
  const fetchSeoData = useCallback(async (scopeKey: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/seo/${scopeKey}`);
      const json = await res.json();
      if (json.success) {
        setSeoData(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch SEO data:', err);
      setSeoData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeoData(selectedKey);
  }, [selectedKey, fetchSeoData]);

  const handleSelect = (scopeKey: string) => {
    setSelectedKey(scopeKey);
  };

  const handleSave = async (data: SeoData) => {
    const currentPage = SEO_PAGES.find((p) => p.scopeKey === selectedKey);
    const res = await fetch(`/api/admin/seo/${selectedKey}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, pageKey: currentPage?.pageKey || selectedKey }),
    });

    const json = await res.json();
    if (!json.success) {
      throw new Error(json.message || 'Failed to save');
    }

    // Mark as configured
    setConfiguredKeys((prev) => {
      const arr = Array.from(prev);
      arr.push(selectedKey);
      return new Set(arr);
    });
    setSeoData(json.data);
  };

  const currentPage = SEO_PAGES.find((p) => p.scopeKey === selectedKey);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-aera-ink">SEO Manager</h1>
        <p className="text-sm text-aera-muted">
          Manage search engine optimization settings for each page
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Left panel - Page list */}
        <div>
          <SeoPageList
            pages={SEO_PAGES}
            selectedKey={selectedKey}
            onSelect={handleSelect}
            configuredKeys={configuredKeys}
          />
        </div>

        {/* Right panel - Editor */}
        <div>
          {loading ? (
            <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
              <div className="text-sm text-aera-muted">Loading SEO data...</div>
            </div>
          ) : currentPage ? (
            <SeoEditorPanel
              key={selectedKey}
              scopeKey={selectedKey}
              pageKey={currentPage.pageKey}
              initialData={seoData}
              onSave={handleSave}
            />
          ) : (
            <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white p-12">
              <div className="text-sm text-aera-muted">Select a page to configure SEO</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
