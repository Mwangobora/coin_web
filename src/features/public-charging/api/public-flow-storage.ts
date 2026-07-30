import type {
  PaymentInitiation,
  PublicPackage,
} from "../types/public-charging.types";

const checkoutPrefix = "charging.customer.checkout.";
const flowPrefix = "charging.customer.flow.";
export const selectionStorageKey = "charging.customer.selectedPackage";

export type StoredSelection = {
  qrToken: string;
  packageItem: PublicPackage;
};

export function saveCheckout(qrToken: string, checkoutToken: string) {
  sessionStorage.setItem(checkoutStorageKey(qrToken), checkoutToken);
}

export function getCheckout(qrToken: string) {
  return sessionStorage.getItem(checkoutStorageKey(qrToken));
}

export function saveSelection(selection: StoredSelection) {
  sessionStorage.setItem(selectionStorageKey, JSON.stringify(selection));
}

export function getSelection(): StoredSelection | null {
  return parseSelection(sessionStorage.getItem(selectionStorageKey));
}

export function checkoutStorageKey(qrToken: string) {
  return checkoutPrefix + qrToken;
}

export function parseSelection(raw: string | null): StoredSelection | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSelection;
  } catch {
    return null;
  }
}

export function savePaymentFlow(payment: PaymentInitiation) {
  sessionStorage.setItem(
    flowPrefix + payment.paymentReference,
    payment.customerFlowToken,
  );
}

export function getPaymentFlow(paymentReference: string) {
  return sessionStorage.getItem(flowPrefix + paymentReference);
}
