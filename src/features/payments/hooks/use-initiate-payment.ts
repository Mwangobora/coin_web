"use client";

import { useMutation } from "@tanstack/react-query";

import { initiatePayment } from "../api/payments.repository";

export function useInitiatePayment() {
  return useMutation({ mutationFn: initiatePayment });
}
