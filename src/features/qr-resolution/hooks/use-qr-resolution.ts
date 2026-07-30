"use client";

import { useQuery } from "@tanstack/react-query";

import { resolveChargingQr } from "../api/qr-resolution.repository";
import { qrTokenSchema } from "../schemas/qr-resolution.schema";

export function useQrResolution(qrToken: string) {
  const parsed = qrTokenSchema.safeParse(qrToken);
  const query = useQuery({
    queryKey: ["qr-resolution", qrToken],
    queryFn: ({ signal }) => {
      signal.throwIfAborted();
      return resolveChargingQr(parsed.data ?? "");
    },
    enabled: parsed.success,
    retry: 1,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
  return { isTokenValid: parsed.success, ...query };
}
