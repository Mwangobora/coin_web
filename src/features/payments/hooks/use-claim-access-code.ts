"use client";

import { useMutation } from "@tanstack/react-query";

import { claimAccessCode } from "../api/payments.repository";

export function useClaimAccessCode() {
  return useMutation({ mutationFn: claimAccessCode });
}
