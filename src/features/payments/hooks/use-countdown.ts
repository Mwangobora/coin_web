"use client";

import { useSyncExternalStore } from "react";

export function useCountdownSeconds(targetIso?: string | null) {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (!targetIso) return () => {};
      const interval = setInterval(onStoreChange, 1000);
      return () => clearInterval(interval);
    },
    () => remaining(targetIso),
    () => remaining(targetIso),
  );
}

export function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function remaining(targetIso?: string | null) {
  if (!targetIso) return 0;
  return Math.max(
    0,
    Math.round((new Date(targetIso).getTime() - Date.now()) / 1000),
  );
}
