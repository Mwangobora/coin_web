import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import type { QrResolution } from "../types/qr-resolution.types";
import { QrDevicePage } from "./qr-device-page";

const mocks = vi.hoisted(() => ({ useQrResolution: vi.fn() }));

vi.mock("../hooks/use-qr-resolution", () => ({
  useQrResolution: () => mocks.useQrResolution(),
}));

test("QR route displays resolved station and device information", () => {
  mocks.useQrResolution.mockReturnValue(successState(baseResponse()));

  render(<QrDevicePage qrToken="DEMO-CHARGER-ONLINE" />);

  expect(screen.getByText("DIT Main Station")).toBeInTheDocument();
  expect(screen.getAllByText(/Smart Mobile Charger/i).length).toBeGreaterThan(
    0,
  );
  expect(screen.getAllByText(/CHARGER-001/i).length).toBeGreaterThan(0);
  expect(screen.getByText("Lockers available")).toBeInTheDocument();
  expect(screen.getByText("Ports available")).toBeInTheDocument();
  expect(screen.getByText("Quick Charge")).toBeInTheDocument();
});

test("offline devices disable package selection", () => {
  mocks.useQrResolution.mockReturnValue(
    successState(baseResponse({ connectivityStatus: "offline" })),
  );

  render(<QrDevicePage qrToken="DEMO-CHARGER-OFFLINE" />);

  expect(screen.getByText("Machine offline")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /quick charge/i })).toBeDisabled();
});

test("maintenance devices disable package selection", () => {
  mocks.useQrResolution.mockReturnValue(
    successState(baseResponse({ status: "maintenance" })),
  );

  render(<QrDevicePage qrToken="DEMO-CHARGER-MAINTENANCE" />);

  expect(screen.getByText("Under maintenance")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /quick charge/i })).toBeDisabled();
});

test("no available locker disables continuation", () => {
  mocks.useQrResolution.mockReturnValue(
    successState(baseResponse({}, { availableLockers: 0 })),
  );

  render(<QrDevicePage qrToken="DEMO-CHARGER-ONLINE" />);

  expect(screen.getByText("No charging slots")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /continue to payment/i }),
  ).toBeDisabled();
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

  render(<QrDevicePage qrToken="DEMO-CHARGER-ONLINE" />);

  expect(screen.getByRole("button", { name: /try again/i })).toBeVisible();
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
        publicPackageId: "QUICK-500",
        name: "Quick Charge",
        description: "Short top up",
        priceMinor: "500",
        currency: "TZS",
        durationSeconds: 1800,
        displayOrder: 1,
      },
    ],
    checkoutToken: "temporary-token",
    expiresAt: new Date().toISOString(),
  };
}
