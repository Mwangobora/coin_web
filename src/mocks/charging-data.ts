import type { QrResolution } from "@/features/qr-resolution/types/qr-resolution.types";

const packages = [
  {
    publicPackageId: "QUICK-500",
    name: "Quick Charge",
    description: "Good for a short top up while you wait.",
    priceMinor: "500",
    currency: "TZS",
    durationSeconds: 30 * 60,
    displayOrder: 1,
    recommended: true,
  },
  {
    publicPackageId: "STANDARD-1000",
    name: "Standard Charge",
    description: "A longer charge for everyday use.",
    priceMinor: "1000",
    currency: "TZS",
    durationSeconds: 60 * 60,
    displayOrder: 2,
  },
];

export const mockQrResponses: Record<string, QrResolution | null> = {
  "DEMO-CHARGER-ONLINE": response("available", "online", 2, 2),
  "DEMO-CHARGER-OFFLINE": response("available", "offline", 2, 2),
  "DEMO-CHARGER-MAINTENANCE": response("maintenance", "online", 0, 0),
  "DEMO-INVALID": null,
};

function response(
  status: string,
  connectivityStatus: string,
  availableLockers: number,
  availablePorts: number,
): QrResolution {
  return {
    station: {
      name: "DIT Main Station",
      region: "Dar es Salaam",
      district: "Ilala",
    },
    device: {
      publicCode: "CHARGER-001",
      name: "Smart Mobile Charger",
      status,
      connectivityStatus,
    },
    availability: { availableLockers, availablePorts },
    packages,
    checkoutToken: "mock-checkout-token",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
  };
}
