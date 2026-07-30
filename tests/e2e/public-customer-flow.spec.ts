import { expect, test } from "@playwright/test";

test("customer reviews charger availability and selects one package on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/charge/DEMO-CHARGER-ONLINE");

  await expect(
    page.getByRole("heading", { name: "DIT Main Station" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Smart Mobile Charger" }),
  ).toBeVisible();
  await expect(page.getByText("CHARGER-001 · online")).toBeVisible();
  await expect(page.getByText("Lockers available")).toBeVisible();
  await expect(page.getByText("Ports available")).toBeVisible();

  const quick = page.getByRole("button", { name: /quick charge/i });
  const standard = page.getByRole("button", { name: /standard charge/i });
  await expect(quick).toHaveAttribute("aria-pressed", "true");
  await standard.click();
  await expect(standard).toHaveAttribute("aria-pressed", "true");

  await page.getByRole("button", { name: /continue to payment/i }).click();
  await expect(
    page.getByText("Payment integration will be connected in the next phase."),
  ).toBeVisible();
});

test("unavailable devices block continuation", async ({ page }) => {
  await page.goto("/charge/DEMO-CHARGER-OFFLINE");

  await expect(page.getByText("Machine offline")).toBeVisible();
  await expect(
    page.getByRole("button", { name: /continue to payment/i }),
  ).toBeDisabled();

  await page.goto("/charge/DEMO-CHARGER-MAINTENANCE");
  await expect(
    page.getByText("This charging machine is temporarily under maintenance."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /continue to payment/i }),
  ).toBeDisabled();
});

test("invalid QR shows a friendly error", async ({ page }) => {
  await page.goto("/charge/DEMO-INVALID");

  await expect(page.getByText("QR code not recognized")).toBeVisible();
  await expect(page.getByText(/scan the machine qr code again/i)).toBeVisible();
});

test("root page has no authentication or admin dashboard UI", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Smart Charging System" }),
  ).toBeVisible();
  await expect(page.getByText(/scan the qr code displayed/i)).toBeVisible();
  await expect(page.getByText(/login/i)).toHaveCount(0);
  await expect(page.getByText(/register/i)).toHaveCount(0);
  await expect(page.getByText(/admin dashboard/i)).toHaveCount(0);
});
