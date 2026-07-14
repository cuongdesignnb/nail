"use client";

import { useCallback, useRef, useState } from "react";
import { settingsEqual } from "@/lib/settings/normalize-settings";

export type SettingsFormState<T> = {
  data: T | null;
  initialData: T | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  fieldErrors: Record<string, string[]>;
  isDirty: boolean;
  lastSavedAt: string | null;
  version?: number;
  updatedBy: string | null;
  publicRevalidated: boolean;
  conflict: boolean;
};

type Options<T> = {
  url: string;
  normalize?: (value: T) => T;
  select?: (responseData: unknown) => T;
};

const NO_STORE = { cache: "no-store" as const, headers: { "Cache-Control": "no-cache" } };

export function useSettingsForm<T>({
  url,
  normalize = (value) => value,
  select = (value) => value as T,
}: Options<T>) {
  const [state, setState] = useState<SettingsFormState<T>>({
    data: null,
    initialData: null,
    loading: false,
    saving: false,
    error: null,
    fieldErrors: {},
    isDirty: false,
    lastSavedAt: null,
    version: undefined,
    updatedBy: null,
    publicRevalidated: false,
    conflict: false,
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  const applyCanonical = useCallback((json: any, saved = false) => {
    const canonical = normalize(select(json.data));
    setState((current) => ({
      ...current,
      data: canonical,
      initialData: canonical,
      loading: false,
      saving: false,
      error: null,
      fieldErrors: {},
      isDirty: false,
      lastSavedAt: saved ? (json.meta?.updatedAt ?? new Date().toISOString()) : current.lastSavedAt,
      version: json.meta?.version,
      updatedBy: json.meta?.updatedBy ?? null,
      publicRevalidated: Boolean(json.meta?.publicRevalidated),
      conflict: false,
    }));
    return canonical;
  }, [normalize, select]);

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null, fieldErrors: {} }));
    try {
      const response = await fetch(url, NO_STORE);
      const json = await response.json();
      if (!response.ok || !json.success) throw Object.assign(new Error(json.error || "Unable to load settings."), { json });
      return applyCanonical(json);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load settings.";
      setState((current) => ({ ...current, loading: false, error: message }));
      throw error;
    }
  }, [applyCanonical, url]);

  const save = useCallback(async () => {
    const current = stateRef.current;
    if (!current.data || current.saving || !current.isDirty) return current.data;
    const submitted = normalize(current.data);
    setState((value) => ({ ...value, saving: true, error: null, fieldErrors: {}, conflict: false }));
    try {
      const response = await fetch(url, {
        method: "PUT",
        cache: "no-store",
        headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" },
        body: JSON.stringify({ data: submitted, expectedVersion: current.version }),
      });
      const json = await response.json();
      if (!response.ok || !json.success) {
        setState((value) => ({
          ...value,
          saving: false,
          error: json.error || "Unable to save settings.",
          fieldErrors: json.issues ?? {},
          conflict: response.status === 409 || json.code === "VERSION_CONFLICT",
        }));
        return null;
      }
      const returned = normalize(select(json.data));
      if (!settingsEqual(submitted, returned)) {
        throw new Error("The canonical saved value did not match the submitted value.");
      }
      const verifyResponse = await fetch(url, NO_STORE);
      const verifyJson = await verifyResponse.json();
      if (!verifyResponse.ok || !verifyJson.success) throw new Error("Settings were saved but could not be reloaded for verification.");
      const verified = normalize(select(verifyJson.data));
      if (!settingsEqual(submitted, verified)) {
        throw new Error("The reloaded settings did not match the submitted value.");
      }
      return applyCanonical({ ...verifyJson, meta: { ...verifyJson.meta, publicRevalidated: json.meta?.publicRevalidated } }, true);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save settings.";
      setState((value) => ({ ...value, saving: false, error: message }));
      return null;
    }
  }, [applyCanonical, normalize, select, url]);

  const setData = useCallback((next: T | ((current: T) => T)) => {
    setState((current) => {
      if (!current.data) return current;
      const value = normalize(typeof next === "function" ? (next as (current: T) => T)(current.data) : next);
      return {
        ...current,
        data: value,
        isDirty: !settingsEqual(value, current.initialData),
        error: null,
        fieldErrors: {},
        lastSavedAt: null,
        publicRevalidated: false,
      };
    });
  }, [normalize]);

  const setField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setData((current) => ({ ...current, [field]: value }));
  }, [setData]);

  const reset = useCallback(() => {
    setState((current) => current.initialData ? {
      ...current,
      data: current.initialData,
      isDirty: false,
      error: null,
      fieldErrors: {},
      conflict: false,
    } : current);
  }, []);

  return { ...state, load, reload: load, save, setData, setField, reset };
}
