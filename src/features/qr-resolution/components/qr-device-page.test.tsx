import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { render } from "@/test/test-utils";

import type { QrResolution } from "../types/qr-resolution.types";
import { QrDevicePage } from "./qr-device-page";

const mocks = vi.hoisted(() => ({ useQrResolution: vi.fn() }));

vi.mock("../hooks/use-qr-resolution", () => ({
  useQrResolution: () => mocks.useQrResolution(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}));

test("QR route starts package selection without showing station details", async () => {
  mocks.useQrResolution.mockReturnValue(successState(baseResponse()));

  render(<QrDevicePage qrToken="cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ" />);

  expect(screen.queryByText("DIT Main Station")).not.toBeInTheDocument();
  expect(screen.queryByText(/Smart Mobile Charger/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/CHARGER-001/i)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /start charging/i })).toBeEnabled();

  await userEvent.click(
    screen.getByRole("button", { name: /start charging/i }),
  );

  expect(screen.getByText("Quick Charge")).toBeInTheDocument();
  expect(screen.getByText("Standard Charge")).toBeInTheDocument();
});

test("offline device data does not block customer payment testing", async () => {
  mocks.useQrResolution.mockReturnValue(
    successState(baseResponse({ connectivityStatus: "offline" })),
  );

  render(<QrDevicePage qrToken="cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ" />);

  expect(screen.queryByText(/offline/i)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: /start charging/i })).toBeEnabled();

  await userEvent.click(
    screen.getByRole("button", { name: /start charging/i }),
  );

  expect(screen.getByText("Quick Charge")).toBeInTheDocument();
  expect(screen.getByText("Standard Charge")).toBeInTheDocument();
});

test("auto start opens package choices immediately for homepage testing", () => {
  mocks.useQrResolution.mockReturnValue(successState(baseResponse()));

  render(
    <QrDevicePage qrToken="cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ" autoStart />,
  );

  expect(screen.queryByRole("button", { name: /start charging/i })).toBeNull();
  expect(screen.getByText("Quick Charge")).toBeInTheDocument();
  expect(screen.getByText("Standard Charge")).toBeInTheDocument();
});

test("network failures display a retry action", () => {
  mocks.useQrResolution.mockReturnValue({
    data: undefined,
    error: { kind: "network", title: "Network problem", message: "Retry." },
    isError: true,
    isLoading: false,
    isTokenValid: true,
    refetch: vi.fn(),
  });

  render(<QrDevicePage qrToken="cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ" />);

  expect(screen.getByRole("button", { name: /try again/i })).toBeVisible();
});

test("loading state displays a skeleton instead of a blank page", () => {
  mocks.useQrResolution.mockReturnValue({
    data: undefined,
    error: null,
    isError: false,
    isLoading: true,
    isTokenValid: true,
    refetch: vi.fn(),
  });

  render(<QrDevicePage qrToken="cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ" />);

  expect(screen.getByText("Loading charger availability")).toBeInTheDocument();
  expect(screen.getByText(/checking machine status/i)).toBeInTheDocument();
});

test("customer flow explains the payment test without device status noise", () => {
  mocks.useQrResolution.mockReturnValue(successState(baseResponse()));

  render(<QrDevicePage qrToken="cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ" />);

  expect(screen.getByText(/choose TZS 200 or TZS 500/i)).toBeInTheDocument();
  expect(screen.queryByText(/machine status/i)).not.toBeInTheDocument();
});

test("malformed route token is rejected before rendering charger data", () => {
  mocks.useQrResolution.mockReturnValue({
    data: undefined,
    error: null,
    isError: false,
    isLoading: false,
    isTokenValid: false,
    refetch: vi.fn(),
  });

  render(<QrDevicePage qrToken="../secret" />);

  expect(screen.getByText("QR code not recognized")).toBeInTheDocument();
});

function successState(data: QrResolution) {
  return {
    data,
    error: null,
    isError: false,
    isLoading: false,
    isTokenValid: true,
    refetch: vi.fn(),
  };
}

function baseResponse(
  device: Partial<QrResolution["device"]> = {},
  availability: Partial<QrResolution["availability"]> = {},
): QrResolution {
  return {
    station: { name: "DIT Main Station", region: "Dar", district: "Ilala" },
    device: {
      publicCode: "CHARGER-001",
      name: "Smart Mobile Charger",
      status: "available",
      connectivityStatus: "online",
      ...device,
    },
    availability: { availableLockers: 2, availablePorts: 2, ...availability },
    packages: [
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
        description: "Longer charging time",
        priceMinor: "500",
        currency: "TZS",
        durationSeconds: 2700,
        displayOrder: 2,
      },
    ],
    checkoutToken: "temporary-token",
    expiresAt: new Date().toISOString(),
  };
}
