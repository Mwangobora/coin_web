"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { publicChargingRepository } from "../api/public-charging.repository";
import {
  paymentReferenceSchema,
  qrTokenSchema,
  sessionReferenceSchema,
} from "../api/public-charging.schemas";
import { isPaymentTerminal } from "../lib/status-copy";

const terminalSessions = new Set([
  "completed",
  "stopped",
  "failed",
  "cancelled",
  "expired",
]);

export function useResolveQr(qrToken: string) {
  const parsed = qrTokenSchema.safeParse(qrToken);
  return useQuery({
    queryKey: ["public-charging", "qr", qrToken],
    queryFn: () => publicChargingRepository.resolveQr(parsed.data ?? ""),
    enabled: parsed.success,
    retry: false,
  });
}

export function usePackages(checkoutToken?: string | null) {
  return useQuery({
    queryKey: ["public-charging", "packages", checkoutToken],
    queryFn: () => publicChargingRepository.listPackages(checkoutToken ?? ""),
    enabled: !!checkoutToken,
  });
}

export function useInitiatePayment() {
  return useMutation({
    mutationFn: publicChargingRepository.initiatePayment,
  });
}

export function usePaymentStatus(reference: string, flowToken?: string | null) {
  const parsed = paymentReferenceSchema.safeParse(reference);
  return useQuery({
    queryKey: ["public-charging", "payment", reference],
    queryFn: () =>
      publicChargingRepository.paymentStatus(
        parsed.data ?? "",
        flowToken ?? "",
      ),
    enabled: parsed.success && !!flowToken,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return isPaymentTerminal(status) ? false : 3_000;
    },
  });
}

export function useClaimAccessCode() {
  return useMutation({
    mutationFn: (input: { sessionReference: string; flowToken: string }) =>
      publicChargingRepository.claimAccessCode(
        input.sessionReference,
        input.flowToken,
      ),
  });
}

export function useSessionStatus(reference: string, flowToken?: string | null) {
  const parsed = sessionReferenceSchema.safeParse(reference);
  return useQuery({
    queryKey: ["public-charging", "session", reference],
    queryFn: () =>
      publicChargingRepository.sessionStatus(
        parsed.data ?? "",
        flowToken ?? "",
      ),
    enabled: parsed.success && !!flowToken,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return terminalSessions.has(status ?? "") ? false : 10_000;
    },
  });
}
