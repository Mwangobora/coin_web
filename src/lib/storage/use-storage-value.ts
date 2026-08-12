"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const serverSnapshot = () => undefined;

/**
 * Reads a browser-only store (sessionStorage etc.) safely across SSR/hydration.
 * Returns `undefined` until the client snapshot is available, so callers can
 * tell "not checked yet" apart from a genuine `null` (checked, not found).
 */
export function useStorageValue<T>(read: () => T | null): T | null | undefined {
  return useSyncExternalStore(noopSubscribe, read, serverSnapshot);
}
