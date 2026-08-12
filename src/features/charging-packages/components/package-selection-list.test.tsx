import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { render } from "@/test/test-utils";

import type { ChargingPackage } from "../types/charging-package.types";
import { PackageSelectionList } from "./package-selection-list";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

test("package cards render and allow one selected package", async () => {
  render(
    <PackageSelectionList
      qrToken="cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ"
      checkoutToken="mock-checkout-token"
      packages={packages}
      disabled={false}
    />,
  );

  const quick = screen.getByRole("button", { name: /quick charge/i });
  const standard = screen.getByRole("button", { name: /standard charge/i });

  expect(screen.getByText("TZS 200")).toBeInTheDocument();
  expect(screen.getByText("TZS 500")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /select amount/i })).toBeDisabled();

  await userEvent.click(standard);

  expect(quick).toHaveAttribute("aria-pressed", "false");
  expect(standard).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("button", { name: /m-pesa/i })).toBeVisible();
  expect(screen.getByRole("button", { name: /mixx by yas/i })).toBeVisible();
  expect(screen.getByRole("button", { name: /airtel money/i })).toBeVisible();
  expect(screen.getByRole("button", { name: /halopesa/i })).toBeVisible();
  expect(
    screen.getByRole("button", { name: /select payment method/i }),
  ).toBeDisabled();

  await userEvent.click(screen.getByRole("button", { name: /m-pesa/i }));

  expect(screen.getByRole("button", { name: /pay tzs 500/i })).toBeEnabled();
});

test("disabled packages cannot be selected or continued", () => {
  render(
    <PackageSelectionList
      qrToken="cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ"
      checkoutToken="mock-checkout-token"
      packages={packages}
      disabled
      disabledReason="This charging machine is currently offline."
    />,
  );

  expect(screen.getByRole("button", { name: /quick charge/i })).toBeDisabled();
  expect(screen.getByRole("button", { name: /select amount/i })).toBeDisabled();
  expect(screen.getByText(/currently offline/i)).toBeInTheDocument();
});

const packages: ChargingPackage[] = [
  {
    publicPackageId: "QUICK-200",
    name: "Quick Charge",
    description: "Short top up",
    priceMinor: "200",
    currency: "TZS",
    durationSeconds: 900,
    displayOrder: 1,
  },
  {
    publicPackageId: "STANDARD-500",
    name: "Standard Charge",
    description: "Longer charge",
    priceMinor: "500",
    currency: "TZS",
    durationSeconds: 2700,
    displayOrder: 2,
    recommended: true,
  },
];
