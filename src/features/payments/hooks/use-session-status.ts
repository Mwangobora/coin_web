"use client";

import { useQuery } from "@tanstack/react-query";

import { getSessionStatus } from "../api/payments.repository";

const TERMINAL_GUIDANCE = new Set(["session_finished", "device_error"]);
const POLL_INTERVAL_MS = 5_000;

export function useSessionStatus(input: {
  sessionReference: string;
  customerFlowToken: string | null;
}) {
  return useQuery({
    queryKey: ["session-status", input.sessionReference],
    queryFn: () =>
      getSessionStatus({
        sessionReference: input.sessionReference,
        customerFlowToken: input.customerFlowToken ?? "",
      }),
    enabled: Boolean(input.customerFlowToken),
    staleTime: 0,
    refetchInterval: (query) =>
      query.state.data && TERMINAL_GUIDANCE.has(query.state.data.guidance)
        ? false
        : POLL_INTERVAL_MS,
  });
}
