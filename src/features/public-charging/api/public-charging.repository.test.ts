import { beforeEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/api-client";

import { publicChargingRepository } from "./public-charging.repository";

vi.mock("@/lib/api/api-client", () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe("publicChargingRepository", () => {
  beforeEach(() => vi.clearAllMocks());

  it("initiates payment with package id and idempotency key only", async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: paymentResponse(),
    });

    await publicChargingRepository.initiatePayment({
      checkoutToken: "checkout",
      packageId: "PKG_500",
      idempotencyKey: "uuid-key",
    });

    expect(apiClient.post).toHaveBeenCalledWith(
      "/public/charging/payments",
      { packageId: "PKG_500", idempotencyKey: "uuid-key" },
      { headers: { "X-Checkout-Token": "checkout" } },
    );
  });

  it("uses no-store when claiming access code", async () => {
    vi.mocked(apiClient.post).mockResolvedValueOnce({
      data: {
        sessionReference: "SESSION-1",
        lockerNumber: 1,
        portNumber: 1,
        accessCode: "4839",
        chargingDurationSeconds: 1200,
        accessCodeExpiresAt: new Date().toISOString(),
        instructions: [],
      },
    });

    await publicChargingRepository.claimAccessCode("SESSION-1", "flow");
    expect(apiClient.post).toHaveBeenCalledWith(
      "/public/charging/sessions/SESSION-1/access-code",
      {},
      {
        headers: {
          "X-Customer-Flow-Token": "flow",
          "Cache-Control": "no-store",
        },
      },
    );
  });
});

function paymentResponse() {
  return {
    paymentReference: "PAY-1",
    merchantReference: "MER-1",
    amountMinor: "500",
    currency: "TZS",
    provider: "mock",
    paymentInstructions: {},
    status: "pending",
    expiresAt: new Date().toISOString(),
    customerFlowToken: "flow",
  };
}
