"use client";

import { useQuery } from "@tanstack/react-query";

import { getPaymentStatus } from "../api/payments.repository";

const TERMINAL_STATUSES = new Set(["confirmed", "failed", "expired"]);
const POLL_INTERVAL_MS = 4_000;

export function usePaymentStatus(input: {
  paymentReference: string;
  customerFlowToken: string | null;
}) {
  return useQuery({
    queryKey: ["payment-status", input.paymentReference],
    queryFn: () =>
      getPaymentStatus({
        paymentReference: input.paymentReference,
        customerFlowToken: input.customerFlowToken ?? "",
      }),
    enabled: Boolean(input.customerFlowToken),
    staleTime: 0,
    refetchInterval: (query) =>
      query.state.data && TERMINAL_STATUSES.has(query.state.data.status)
        ? false
        : POLL_INTERVAL_MS,
  });
}
