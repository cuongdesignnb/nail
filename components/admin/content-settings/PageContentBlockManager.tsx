"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { FormField, FormTextarea } from "@/components/common/FormField";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Plus, Edit2, Trash2, X, Save } from "lucide-react";

function ContentBlockManagerPanel() {
  const searchParams = useSearchParams();
  const pageKey = searchParams.get("pageKey") || "home";

  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState("");

  // Editor states
  const [editId, setEditId] = useState<string | null>(null);
  const [sectionKey, setSectionKey] = useState("");
  const [blockKey, setBlockKey] = useState("");
  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchBlocks();
    handleCancel();
  }, [pageKey]);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/page-content-blocks?pageKey=${pageKey}`);
      if (res.ok) {
        const json = await res.json();
        setList(json.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (block: any) => {
    setEditId(block.id);
    setSectionKey(block.sectionKey || "");
    setBlockKey(block.blockKey || "");
    setLabel(block.label || "");
    setValue(block.value || "");
    setSortOrder(block.sortOrder || 0);
    setIsActive(block.isActive ?? true);
    setErrors({});
    setGlobalError("");
  };

  const handleCancel = () => {
    setEditId(null);
    setSectionKey("");
    setBlockKey("");
    setLabel("");
    setValue("");
    setSortOrder(0);
    setIsActive(true);
    setErrors({});
    setGlobalError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setErrors({});
    setGlobalError("");

    const payload = {
      pageKey,
      sectionKey,
      blockKey,
      label: label || null,
      value: value || null,
      sortOrder: Number(sortOrder),
      isActive,
    };

    try {
      const url = editId ? `/api/admin/page-content-blocks/${editId}` : "/api/admin/page-content-blocks";
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        if (json.errors) {
          setErrors(json.errors);
        } else {
          setGlobalError(json.message || "Operation failed");
        }
      } else {
        handleCancel();
        fetchBlocks();
      }
    } catch (err) {
      console.error(err);
      setGlobalError("Connection error.");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this block?")) return;
    try {
      const res = await fetch(`/api/admin/page-content-blocks/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchBlocks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pageLabel = pageKey.charAt(0).toUpperCase() + pageKey.slice(1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left font-sans">
      {/* List side */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-aera-champagne/45 shadow-luxury">
        <h3 className="font-heading text-sm font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3">
          Custom Content Blocks ({pageLabel})
        </h3>

        {loading ? (
          <p className="text-xs text-aera-muted italic py-6 text-center">Loading blocks...</p>
        ) : (
          <div className="space-y-4">
            {list.map((block) => (
              <div key={block.id} className="p-4 border border-aera-champagne/30 rounded-2xl flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <span className="text-[9px] bg-aera-champagne/40 px-2 py-0.5 rounded text-aera-accent font-bold uppercase tracking-wider">
                    {block.sectionKey} : {block.blockKey}
                  </span>
                  <h4 className="font-semibold text-xs text-aera-ink pt-1.5">{block.label || "Untitled label"}</h4>
                  <p className="text-[10px] text-aera-muted leading-relaxed font-mono bg-gray-50 border p-2 rounded mt-1 whitespace-pre-wrap">{block.value}</p>
                  <div className="flex gap-3 items-center pt-2">
                    <span className="text-[9px] text-gray-400">Order: {block.sortOrder}</span>
                    <StatusBadge active={block.isActive} />
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => handleEdit(block)}
                    className="p-1.5 text-gray-500 hover:text-aera-accent bg-transparent border-none cursor-pointer"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(block.id)}
                    className="p-1.5 text-gray-500 hover:text-rose-600 bg-transparent border-none cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
            {list.length === 0 && (
              <p className="text-xs text-aera-muted italic py-6 text-center">No content blocks found. Default values will be used.</p>
            )}
          </div>
        )}
      </div>

      {/* Editor Form side */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-aera-champagne/45 shadow-luxury self-start">
        <h3 className="font-heading text-sm font-normal text-aera-ink mb-6 border-b border-aera-champagne/60 pb-3 flex justify-between items-center">
          <span>{editId ? "Edit Block" : "Add Content Block"}</span>
          {editId && (
            <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer">
              <X size={15} />
            </button>
          )}
        </h3>

        {globalError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-4 mb-4 font-semibold">
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Section Key *"
              value={sectionKey}
              onChange={(e) => setSectionKey(e.target.value)}
              placeholder="e.g. membership"
              error={errors.sectionKey?.[0]}
            />
            <FormField
              label="Block Key *"
              value={blockKey}
              onChange={(e) => setBlockKey(e.target.value)}
              placeholder="e.g. promo_title"
              error={errors.blockKey?.[0]}
            />
          </div>
          <FormField
            label="Block Label / Description"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Membership Promo Subtitle"
            error={errors.label?.[0]}
          />
          <FormTextarea
            label="Block Content Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Input override content copy..."
            error={errors.value?.[0]}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4 border-t border-aera-champagne/20 pt-4 mt-4">
            <FormField
              label="Sort Order"
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              error={errors.sortOrder?.[0]}
            />
            <div className="pt-6">
              <FormField
                label="Is Active"
                type="checkbox"
                checked={isActive}
                onChange={(e: any) => setIsActive(e.target.checked)}
                error={errors.isActive?.[0]}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {editId && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full border-none cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={saveLoading}
              className="bg-aera-accent hover:bg-aera-accentHover text-white text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer border-none shadow-sm flex items-center gap-1.5"
            >
              {editId ? <Save size={13} /> : <Plus size={13} />}
              <span>{saveLoading ? "Saving..." : editId ? "Save Block" : "Add Block"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function PageContentBlockManager() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading block content...</div>}>
      <ContentBlockManagerPanel />
    </Suspense>
  );
}
export default PageContentBlockManager;
