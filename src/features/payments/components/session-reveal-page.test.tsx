import { screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";

import type { AccessCodeClaim } from "@/features/payments/types/payment.types";
import {
  resetCheckoutStorageCache,
  saveAccessCodeClaim,
  saveSessionFlowToken,
} from "@/lib/storage/checkout-storage";
import { render } from "@/test/test-utils";

import { SessionRevealPage } from "./session-reveal-page";

const mocks = vi.hoisted(() => ({
  useClaimAccessCode: vi.fn(),
  useSessionStatus: vi.fn(),
  push: vi.fn(),
  replace: vi.fn(),
}));

vi.mock("../hooks/use-claim-access-code", () => ({
  useClaimAccessCode: () => mocks.useClaimAccessCode(),
}));

vi.mock("../hooks/use-session-status", () => ({
  useSessionStatus: () => mocks.useSessionStatus(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push, replace: mocks.replace }),
}));

afterEach(() => {
  window.sessionStorage.clear();
  resetCheckoutStorageCache();
  vi.clearAllMocks();
});

test("shows the access code immediately when already claimed on this device", async () => {
  saveSessionFlowToken("SESSION-1", "flow-token-1");
  saveAccessCodeClaim(claim());
  mocks.useClaimAccessCode.mockReturnValue({ mutate: vi.fn(), isError: false });
  mocks.useSessionStatus.mockReturnValue({
    data: { guidance: "enter_access_code", remainingSeconds: 900 },
  });

  render(
    <SessionRevealPage
      qrToken="cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ"
      sessionReference="SESSION-1"
    />,
  );

  expect(await screen.findByText("4821")).toBeInTheDocument();
  expect(screen.getByText(/locker 3/i)).toBeInTheDocument();
});

test("shows an error when no session exists on this device", async () => {
  mocks.useClaimAccessCode.mockReturnValue({ mutate: vi.fn(), isError: false });
  mocks.useSessionStatus.mockReturnValue({ data: undefined });

  render(
    <SessionRevealPage
      qrToken="cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ"
      sessionReference="SESSION-1"
    />,
  );

  expect(await screen.findByText(/session not found/i)).toBeInTheDocument();
});

function claim(): AccessCodeClaim {
  return {
    sessionReference: "SESSION-1",
    lockerNumber: 3,
    portNumber: 1,
    accessCode: "4821",
    chargingDurationSeconds: 900,
    accessCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    instructions: ["Enter this code on the charging machine keypad."],
  };
}
