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
      qrToken="DEMO-CHARGER-ONLINE"
      checkoutToken="mock-checkout-token"
      packages={packages}
      disabled={false}
    />,
  );

  const quick = screen.getByRole("button", { name: /quick charge/i });
  const standard = screen.getByRole("button", { name: /standard charge/i });

  expect(screen.getByText("TZS 500")).toBeInTheDocument();
  expect(screen.getByText("TZS 1,000")).toBeInTheDocument();
  expect(quick).toHaveAttribute("aria-pressed", "true");

  await userEvent.click(standard);

  expect(quick).toHaveAttribute("aria-pressed", "false");
  expect(standard).toHaveAttribute("aria-pressed", "true");
});

test("disabled packages cannot be selected or continued", () => {
  render(
    <PackageSelectionList
      qrToken="DEMO-CHARGER-ONLINE"
      checkoutToken="mock-checkout-token"
      packages={packages}
      disabled
      disabledReason="This charging machine is currently offline."
    />,
  );

  expect(screen.getByRole("button", { name: /quick charge/i })).toBeDisabled();
  expect(
    screen.getByRole("button", { name: /continue to payment/i }),
  ).toBeDisabled();
  expect(screen.getByText(/currently offline/i)).toBeInTheDocument();
});

const packages: ChargingPackage[] = [
  {
    publicPackageId: "QUICK-500",
    name: "Quick Charge",
    description: "Short top up",
    priceMinor: "500",
    currency: "TZS",
    durationSeconds: 1800,
    displayOrder: 1,
    recommended: true,
  },
  {
    publicPackageId: "STANDARD-1000",
    name: "Standard Charge",
    description: "Longer charge",
    priceMinor: "1000",
    currency: "TZS",
    durationSeconds: 3600,
    displayOrder: 2,
  },
];
