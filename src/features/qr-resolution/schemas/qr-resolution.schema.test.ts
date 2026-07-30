import { expect, test } from "vitest";

import { qrResolutionSchema, qrTokenSchema } from "./qr-resolution.schema";

test("qrTokenSchema accepts safe opaque tokens", () => {
  expect(qrTokenSchema.parse("DEMO-CHARGER_123")).toBe("DEMO-CHARGER_123");
});

test("qrTokenSchema rejects empty or malformed tokens", () => {
  expect(qrTokenSchema.safeParse("")).not.toHaveProperty("success", true);
  expect(qrTokenSchema.safeParse("../secret")).not.toHaveProperty(
    "success",
    true,
  );
});

test("qrResolutionSchema validates safe API responses", () => {
  const parsed = qrResolutionSchema.parse({
    station: { name: "DIT Main Station", region: "Dar", district: "Ilala" },
    device: {
      publicCode: "CHARGER-001",
      name: "Smart Mobile Charger",
      status: "available",
      connectivityStatus: "online",
    },
    availability: { availableLockers: 2, availablePorts: 2 },
    packages: [
      {
        publicPackageId: "QUICK-500",
        name: "Quick Charge",
        description: "Top up",
        priceMinor: "500",
        currency: "TZS",
        durationSeconds: 1800,
        displayOrder: 1,
      },
    ],
    checkoutToken: "temporary-token",
    expiresAt: new Date().toISOString(),
  });

  expect(parsed.station.name).toBe("DIT Main Station");
  expect(
    qrResolutionSchema.safeParse({
      station: {},
      device: {},
      availability: {},
      packages: [],
    }).success,
  ).toBe(false);
});
