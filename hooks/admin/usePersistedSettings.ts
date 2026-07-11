"use client";

import { useCallback, useRef, useState } from "react";
import { settingsEqual } from "@/lib/settings/normalize-settings";

export type PersistedSettingsState<T> = {
  data: T | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  isDirty: boolean;
  lastSavedAt: string | null;
};

type Options<T> = {
  url: string;
  normalize?: (value: T) => T;
  select?: (responseData: unknown) => T;
};

const NO_STORE_HEADERS = { "Cache-Control": "no-cache" };

export function usePersistedSettings<T>({ url, normalize = (value) => value, select = (value) => value as T }: Options<T>) {
  const [state, setState] = useState<PersistedSettingsState<T>>({
    data: null, loading: false, saving: false, error: null, isDirty: false, lastSavedAt: null,
  });
  const lastLoaded = useRef<T | null>(null);

  const load = useCallback(async (): Promise<T> => {
    setState((current) => ({ ...current, loading: true, error: null }));
    try {
      const response = await fetch(url, { cache: "no-store", headers: NO_STORE_HEADERS });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error || json.message || "Unable to load settings.");
      const data = normalize(select(json.data));
      lastLoaded.current = data;
      setState((current) => ({ ...current, data, loading: false, isDirty: false }));
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to load settings.";
      setState((current) => ({ ...current, loading: false, error: message }));
      throw error;
    }
  }, [normalize, select, url]);

  const save = useCallback(async (payload: T): Promise<T> => {
    const expected = normalize(payload);
    setState((current) => ({ ...current, saving: true, error: null, lastSavedAt: null }));
    try {
      const response = await fetch(url, {
        method: "PUT",
        cache: "no-store",
        headers: { "Content-Type": "application/json", ...NO_STORE_HEADERS },
        body: JSON.stringify(expected),
      });
      const json = await response.json();
      if (response.status === 409) throw new Error("This information was updated by another administrator. Reload the latest version before saving.");
      if (!response.ok || !json.success) throw new Error(json.error || json.message || "Unable to save settings.");

      const verifyResponse = await fetch(url, { cache: "no-store", headers: NO_STORE_HEADERS });
      const verifyJson = await verifyResponse.json();
      if (!verifyResponse.ok || !verifyJson.success) throw new Error("Your changes could not be verified after saving. Please reload and try again.");
      const verified = normalize(select(verifyJson.data));
      if (!settingsEqual(expected, verified)) throw new Error("Your changes could not be verified after saving. Please reload and try again.");

      lastLoaded.current = verified;
      const savedAt = new Date().toISOString();
      setState((current) => ({ ...current, data: verified, saving: false, isDirty: false, lastSavedAt: savedAt }));
      return verified;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save settings.";
      setState((current) => ({ ...current, saving: false, error: message }));
      throw error;
    }
  }, [normalize, select, url]);

  const setData = useCallback((data: T) => {
    const normalized = normalize(data);
    setState((current) => ({ ...current, data: normalized, isDirty: !settingsEqual(normalized, lastLoaded.current), lastSavedAt: null }));
  }, [normalize]);

  const resetError = useCallback(() => setState((current) => ({ ...current, error: null })), []);

  return { ...state, load, save, reload: load, resetError, setData };
}

