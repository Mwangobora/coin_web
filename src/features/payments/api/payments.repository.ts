import { apiClient } from "@/lib/api/api-client";
import { env } from "@/lib/config/env";
import { mapPublicError } from "@/lib/errors/public-error";
import {
  mockClaimAccessCode,
  mockGetPaymentStatus,
  mockGetSessionStatus,
  mockInitiatePayment,
} from "@/mocks/payments-data";

import {
  accessCodeClaimSchema,
  paymentInitiationSchema,
  paymentStatusSchema,
  sessionStatusSchema,
} from "../schemas/payment.schema";
import { CHECKOUT_TOKEN_HEADER, CUSTOMER_FLOW_HEADER } from "./payment-headers";

export async function initiatePayment(input: {
  checkoutToken: string;
  packageId: string;
  idempotencyKey: string;
  paymentMethod: string;
}) {
  if (env.NEXT_PUBLIC_USE_MOCK_API) {
    await delay();
    return mockInitiatePayment(input);
  }
  try {
    const response = await apiClient.post(
      "/public/charging/payments",
      {
        packageId: input.packageId,
        idempotencyKey: input.idempotencyKey,
        paymentMethod: input.paymentMethod,
      },
      { headers: { [CHECKOUT_TOKEN_HEADER]: input.checkoutToken } },
    );
    return paymentInitiationSchema.parse(response.data);
  } catch (error) {
    throw mapPublicError(error);
  }
}

export async function getPaymentStatus(input: {
  paymentReference: string;
  customerFlowToken: string;
}) {
  if (env.NEXT_PUBLIC_USE_MOCK_API) {
    await delay();
    return mockGetPaymentStatus(
      input.paymentReference,
      input.customerFlowToken,
    );
  }
  try {
    const response = await apiClient.get(
      `/public/charging/payments/${input.paymentReference}/status`,
      { headers: { [CUSTOMER_FLOW_HEADER]: input.customerFlowToken } },
    );
    return paymentStatusSchema.parse(response.data);
  } catch (error) {
    throw mapPublicError(error);
  }
}

export async function claimAccessCode(input: {
  sessionReference: string;
  customerFlowToken: string;
}) {
  if (env.NEXT_PUBLIC_USE_MOCK_API) {
    await delay();
    return mockClaimAccessCode(input.sessionReference, input.customerFlowToken);
  }
  try {
    const response = await apiClient.post(
      `/public/charging/sessions/${input.sessionReference}/access-code`,
      {},
      { headers: { [CUSTOMER_FLOW_HEADER]: input.customerFlowToken } },
    );
    return accessCodeClaimSchema.parse(response.data);
  } catch (error) {
    throw mapPublicError(error);
  }
}

export async function getSessionStatus(input: {
  sessionReference: string;
  customerFlowToken: string;
}) {
  if (env.NEXT_PUBLIC_USE_MOCK_API) {
    await delay();
    return mockGetSessionStatus(
      input.sessionReference,
      input.customerFlowToken,
    );
  }
  try {
    const response = await apiClient.get(
      `/public/charging/sessions/${input.sessionReference}`,
      { headers: { [CUSTOMER_FLOW_HEADER]: input.customerFlowToken } },
    );
    return sessionStatusSchema.parse(response.data);
  } catch (error) {
    throw mapPublicError(error);
  }
}

function delay() {
  return new Promise((resolve) => setTimeout(resolve, 300));
}
