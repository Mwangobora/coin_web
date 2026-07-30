import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("**/api/v1/public/charging/qr/resolve", async (route) => {
    await route.fulfill({ json: qrResolveBody() });
  });
  await page.route("**/api/v1/public/charging/packages", async (route) => {
    await route.fulfill({ json: { items: [packageBody()] } });
  });
  await page.route(/\/api\/v1\/public\/charging\/payments$/, async (route) => {
    const body = route.request().postDataJSON();
    expect(body.packageId).toBe("PKG_500");
    expect(body.idempotencyKey).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    await route.fulfill({ json: paymentBody("pending") });
  });
  let statusCalls = 0;
  await page.route(
    /\/api\/v1\/public\/charging\/payments\/PAY-1001\/status$/,
    async (route) => {
      statusCalls += 1;
      await route.fulfill({
        json:
          statusCalls > 1
            ? paymentStatus("confirmed")
            : paymentStatus("pending"),
      });
    },
  );
  await page.route(
    "**/api/v1/public/charging/sessions/SESSION-1",
    async (route) => {
      await route.fulfill({ json: sessionBody() });
    },
  );
  await page.route(
    "**/api/v1/public/charging/sessions/SESSION-1/access-code",
    async (route) => {
      await route.fulfill({ json: accessCodeBody() });
    },
  );
});

test("customer completes QR to one-time PIN flow on mobile", async ({
  page,
}) => {
  await page.goto("/charge/public_token_123456789");
  await page.getByRole("link", { name: /select package/i }).click();
  await expect(page.getByText("Quick Charge")).toBeVisible();
  await expect(page.getByText("TZS 500")).toBeVisible();
  await page.getByRole("button", { name: /quick charge/i }).click();
  await page.getByRole("button", { name: /continue/i }).click();

  await page.getByRole("button", { name: /start payment/i }).click();
  await expect(page).toHaveURL(/payment\/PAY-1001/);
  await expect(page.getByText("Payment confirmed")).toBeVisible({
    timeout: 8000,
  });
  await page.getByRole("link", { name: /open locker pin/i }).click();

  await page.getByRole("button", { name: /show my pin/i }).click();
  await expect(page.getByText("4839")).toBeVisible();
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  expect(
    await page.evaluate(() => JSON.stringify(sessionStorage).includes("4839")),
  ).toBe(false);
  expect(page.url()).not.toContain("4839");

  await page.getByLabel(/i have saved/i).check();
  await page.getByRole("button", { name: /^continue$/i }).click();
  await expect(page.getByText("4839")).toHaveCount(0);
});

test("invalid QR shows friendly error", async ({ page }) => {
  await page.route("**/api/v1/public/charging/qr/resolve", async (route) => {
    await route.fulfill({ status: 404, json: { message: "not found" } });
  });
  await page.goto("/charge/public_token_123456789");
  await expect(page.getByText("QR code not available")).toBeVisible();
});

function qrResolveBody() {
  return {
    station: { name: "Central Station", region: "Dar", district: "Kinondoni" },
    device: {
      publicCode: "DEVICE-01",
      name: "Charger 1",
      status: "available",
      connectivityStatus: "online",
    },
    availability: { availableLockers: 2, availablePorts: 2 },
    packages: [packageBody()],
    checkoutToken: "checkout-token",
    expiresAt: new Date(Date.now() + 600_000).toISOString(),
  };
}

function packageBody() {
  return {
    publicPackageId: "PKG_500",
    name: "Quick Charge",
    description: "Small top-up",
    priceMinor: "500",
    currency: "TZS",
    durationSeconds: 1200,
    displayOrder: 1,
  };
}

function paymentBody(status: string) {
  return {
    paymentReference: "PAY-1001",
    merchantReference: "MER-1",
    amountMinor: "500",
    currency: "TZS",
    provider: "mock",
    paymentInstructions: { qrReference: "QR-1" },
    status,
    expiresAt: new Date(Date.now() + 300_000).toISOString(),
    customerFlowToken: "flow-token",
  };
}

function paymentStatus(status: string) {
  return {
    paymentReference: "PAY-1001",
    status,
    amountMinor: "500",
    currency: "TZS",
    expiresAt: new Date(Date.now() + 300_000).toISOString(),
    sessionReference: status === "confirmed" ? "SESSION-1" : undefined,
    canClaimLockerPin: status === "confirmed",
  };
}

function sessionBody() {
  return {
    sessionReference: "SESSION-1",
    status: "pending",
    lockerNumber: 1,
    portNumber: 1,
    stationName: "Central Station",
    deviceName: "Charger 1",
    packageName: "Quick Charge",
    amountPaidMinor: "500",
    currency: "TZS",
    purchasedDurationSeconds: 1200,
    remainingSeconds: 1200,
    guidance: "Enter PIN on the machine.",
  };
}

function accessCodeBody() {
  return {
    sessionReference: "SESSION-1",
    lockerNumber: 1,
    portNumber: 1,
    accessCode: "4839",
    chargingDurationSeconds: 1200,
    accessCodeExpiresAt: new Date(Date.now() + 600_000).toISOString(),
    instructions: [],
  };
}
