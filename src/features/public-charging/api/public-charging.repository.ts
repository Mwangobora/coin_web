import { apiClient } from "@/lib/api/api-client";

import {
  accessCodeClaimSchema,
  packageSchema,
  paymentInitiationSchema,
  paymentStatusSchema,
  qrResolutionSchema,
  sessionSchema,
} from "./public-charging.schemas";

const base = "/public/charging";

export const publicChargingRepository = {
  async resolveQr(qrToken: string) {
    const response = await apiClient.post(`${base}/qr/resolve`, { qrToken });
    return qrResolutionSchema.parse(response.data);
  },

  async listPackages(checkoutToken: string) {
    const response = await apiClient.get(`${base}/packages`, {
      headers: checkoutHeaders(checkoutToken),
    });
    return packageSchema.array().parse(response.data.items);
  },

  async initiatePayment(input: {
    checkoutToken: string;
    packageId: string;
    idempotencyKey: string;
  }) {
    const response = await apiClient.post(
      `${base}/payments`,
      {
        packageId: input.packageId,
        idempotencyKey: input.idempotencyKey,
      },
      { headers: checkoutHeaders(input.checkoutToken) },
    );
    return paymentInitiationSchema.parse(response.data);
  },

  async paymentStatus(paymentReference: string, flowToken: string) {
    const response = await apiClient.get(
      `${base}/payments/${paymentReference}/status`,
      { headers: flowHeaders(flowToken) },
    );
    return paymentStatusSchema.parse(response.data);
  },

  async claimAccessCode(sessionReference: string, flowToken: string) {
    const response = await apiClient.post(
      `${base}/sessions/${sessionReference}/access-code`,
      {},
      { headers: { ...flowHeaders(flowToken), "Cache-Control": "no-store" } },
    );
    return accessCodeClaimSchema.parse(response.data);
  },

  async sessionStatus(sessionReference: string, flowToken: string) {
    const response = await apiClient.get(
      `${base}/sessions/${sessionReference}`,
      {
        headers: { ...flowHeaders(flowToken), "Cache-Control": "no-store" },
      },
    );
    return sessionSchema.parse(response.data);
  },
};

function checkoutHeaders(token: string) {
  return { "X-Checkout-Token": token };
}

function flowHeaders(token: string) {
  return { "X-Customer-Flow-Token": token };
}
