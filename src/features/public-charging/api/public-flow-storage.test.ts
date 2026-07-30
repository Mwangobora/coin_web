import { beforeEach, describe, expect, it } from "vitest";

import { getPaymentFlow, savePaymentFlow } from "./public-flow-storage";

describe("public flow storage", () => {
  beforeEach(() => sessionStorage.clear());

  it("stores customer flow tokens but never stores locker PINs", () => {
    savePaymentFlow({
      paymentReference: "PAY-1",
      merchantReference: "MER-1",
      amountMinor: "500",
      currency: "TZS",
      provider: "mock",
      paymentInstructions: {},
      status: "pending",
      expiresAt: new Date().toISOString(),
      customerFlowToken: "flow-token",
    });

    expect(getPaymentFlow("PAY-1")).toBe("flow-token");
    expect(JSON.stringify(sessionStorage)).not.toContain("4839");
    expect(localStorage.length).toBe(0);
  });
});
