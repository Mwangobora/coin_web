import { apiClient } from "@/lib/api/api-client";
import { env } from "@/lib/config/env";
import { mapPublicError } from "@/lib/errors/public-error";
import { resolveMockChargingQr } from "@/mocks/charging-repository";

import { qrResolutionSchema } from "../schemas/qr-resolution.schema";

export async function resolveChargingQr(qrToken: string) {
  if (env.NEXT_PUBLIC_USE_MOCK_API) {
    return resolveMockChargingQr(qrToken);
  }
  try {
    const response = await apiClient.post("/public/charging/qr/resolve", {
      qrToken,
    });
    return qrResolutionSchema.parse(response.data);
  } catch (error) {
    throw mapPublicError(error);
  }
}
