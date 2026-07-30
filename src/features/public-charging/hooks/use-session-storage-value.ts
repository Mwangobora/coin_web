"use client";

import { useCallback, useSyncExternalStore } from "react";

export function useSessionStorageItem(key: string | null) {
  const getSnapshot = useCallback(() => {
    if (!key) return null;
    return sessionStorage.getItem(key);
  }, [key]);
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("storage", onChange);
    return () => window.removeEventListener("storage", onChange);
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, () => null);
}
