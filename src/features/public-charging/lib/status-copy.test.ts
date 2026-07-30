import { describe, expect, it } from "vitest";

import {
  canPay,
  isPaymentTerminal,
  paymentCopy,
  sessionCopy,
} from "./status-copy";

describe("public customer status copy", () => {
  it("maps statuses to customer-friendly language", () => {
    expect(paymentCopy("confirmed")).toBe("Payment confirmed");
    expect(sessionCopy("active")).toBe("Charging started");
    expect(sessionCopy("failed")).toBe("Device problem");
  });

  it("disables payment when the charger is not ready", () => {
    expect(
      canPay({
        deviceStatus: "available",
        connectivityStatus: "online",
        availableLockers: 1,
        availablePorts: 1,
      }),
    ).toBe(true);
    expect(
      canPay({
        deviceStatus: "available",
        connectivityStatus: "offline",
        availableLockers: 1,
        availablePorts: 1,
      }),
    ).toBe(false);
  });

  it("stops polling on terminal payment statuses", () => {
    expect(isPaymentTerminal("confirmed")).toBe(true);
    expect(isPaymentTerminal("pending")).toBe(false);
  });
});
