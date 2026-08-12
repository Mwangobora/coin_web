import { expect, test } from "@playwright/test";

test("customer reviews charger availability and selects one package on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/charge/cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ");

  await page.getByRole("button", { name: /start charging/i }).click();

  const quick = page.getByRole("button", { name: /quick charge/i });
  const standard = page.getByRole("button", { name: /standard charge/i });
  await expect(quick).toHaveAttribute("aria-pressed", "false");
  await standard.click();
  await expect(standard).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: /m-pesa/i }).click();

  await page.getByRole("button", { name: /pay tzs 500/i }).click();
  await expect(page.getByText(/payment accepted/i)).toBeVisible();
});

test("invalid QR shows a friendly error", async ({ page }) => {
  await page.goto("/charge/INVALID-QR");

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
  await expect(
    page.getByText(/scan the qr code on the charging machine/i),
  ).toBeVisible();
  await expect(page.getByText(/login/i)).toHaveCount(0);
  await expect(page.getByText(/register/i)).toHaveCount(0);
  await expect(page.getByText(/admin dashboard/i)).toHaveCount(0);
});
