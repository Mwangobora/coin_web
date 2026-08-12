import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

test("mock mode does not call the remote API", async () => {
  const post = vi.fn();
  vi.stubEnv("NEXT_PUBLIC_USE_MOCK_API", "true");
  vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:4000/api/v1");
  vi.doMock("@/lib/api/api-client", () => ({ apiClient: { post } }));

  const { resolveChargingQr } = await import("./qr-resolution.repository");
  const result = await resolveChargingQr(
    "cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ",
  );

  expect(result.station.name).toBe("DIT Main Station");
  expect(post).not.toHaveBeenCalled();
});
