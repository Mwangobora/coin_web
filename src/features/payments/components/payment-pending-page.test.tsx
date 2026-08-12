import { screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import type { PaymentInitiation } from "@/features/payments/types/payment.types";
import {
  resetCheckoutStorageCache,
  saveCheckoutFlow,
} from "@/lib/storage/checkout-storage";
import { render } from "@/test/test-utils";

import { PaymentPendingPage } from "./payment-pending-page";

const mocks = vi.hoisted(() => ({
  usePaymentStatus: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
}));

vi.mock("../hooks/use-payment-status", () => ({
  usePaymentStatus: () => mocks.usePaymentStatus(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push, replace: mocks.replace }),
}));

afterEach(() => {
  window.sessionStorage.clear();
  resetCheckoutStorageCache();
  vi.clearAllMocks();
});

test("shows the amount, QR payload, and merchant reference while pending", async () => {
  saveCheckoutFlow(initiation());
  mocks.usePaymentStatus.mockReturnValue({
    data: { status: "pending" },
    isError: false,
  });

  render(
    <PaymentPendingPage qrToken="DEMO-CHARGER-ONLINE" paymentReference="PAY-1" />,
  );

  expect(await screen.findByText("TZS 200")).toBeInTheDocument();
  expect(screen.getByText("QR-PAY-1")).toBeInTheDocument();
  expect(
    screen.getByText(/waiting for your payment to be confirmed/i),
  ).toBeInTheDocument();
});

test("redirects to the session page once payment is confirmed", async () => {
  saveCheckoutFlow(initiation());
  mocks.usePaymentStatus.mockReturnValue({
    data: { status: "confirmed", sessionReference: "SESSION-1" },
    isError: false,
  });

  render(
    <PaymentPendingPage qrToken="DEMO-CHARGER-ONLINE" paymentReference="PAY-1" />,
  );

  expect(mocks.replace).toHaveBeenCalledWith(
    "/charge/DEMO-CHARGER-ONLINE/session/SESSION-1",
  );
});

test("shows an error when no payment session exists on this device", async () => {
  mocks.usePaymentStatus.mockReturnValue({ data: undefined, isError: false });

  render(
    <PaymentPendingPage qrToken="DEMO-CHARGER-ONLINE" paymentReference="PAY-1" />,
  );

  expect(
    await screen.findByText(/payment session not found/i),
  ).toBeInTheDocument();
});

function initiation(): PaymentInitiation {
  return {
    paymentReference: "PAY-1",
    merchantReference: "QR-PAY-1",
    amountMinor: "200",
    currency: "TZS",
    provider: "mock",
    paymentInstructions: { qrReference: "mock://pay/PAY-1" },
    status: "pending",
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    customerFlowToken: "flow-token-1",
  };
}
