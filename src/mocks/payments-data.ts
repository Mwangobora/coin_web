import type {
  AccessCodeClaim,
  PaymentInitiation,
  PaymentStatus,
  SessionStatus,
} from "@/features/payments/types/payment.types";

const CONFIRM_AFTER_MS = 900;
const ACCESS_CODE_TTL_MS = 15 * 60 * 1000;

type MockPayment = {
  initiation: PaymentInitiation;
  createdAt: number;
  packageId: string;
  amountMinor: string;
  currency: string;
  sessionReference: string;
  accessCodeClaimed: boolean;
};

const payments = new Map<string, MockPayment>();
const sessions = new Map<
  string,
  { paymentReference: string; startedAt: number }
>();

export function mockInitiatePayment(input: {
  checkoutToken: string;
  packageId: string;
}): PaymentInitiation {
  if (input.checkoutToken !== "mock-checkout-token") {
    throw invalidCheckout();
  }
  const price = input.packageId === "STANDARD-500" ? "500" : "200";
  const paymentReference = `MOCK-PAY-${input.packageId}-${payments.size + 1}`;
  const sessionReference = `MOCK-SESSION-${payments.size + 1}`;
  const initiation: PaymentInitiation = {
    paymentReference,
    merchantReference: `QR-${paymentReference}`,
    amountMinor: price,
    currency: "TZS",
    provider: "fake-money",
    paymentInstructions: { qrReference: `mock://pay/${paymentReference}` },
    status: "pending",
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    customerFlowToken: `mock-flow-${paymentReference}`,
  };
  payments.set(paymentReference, {
    initiation,
    createdAt: Date.now(),
    packageId: input.packageId,
    amountMinor: price,
    currency: "TZS",
    sessionReference,
    accessCodeClaimed: false,
  });
  return initiation;
}

export function mockGetPaymentStatus(
  paymentReference: string,
  flowToken: string,
): PaymentStatus {
  const record = payments.get(paymentReference);
  if (!record || record.initiation.customerFlowToken !== flowToken) {
    throw notFound();
  }
  const confirmed = Date.now() - record.createdAt >= CONFIRM_AFTER_MS;
  if (confirmed && !sessions.has(record.sessionReference)) {
    sessions.set(record.sessionReference, {
      paymentReference,
      startedAt: Date.now(),
    });
  }
  return {
    paymentReference,
    status: confirmed ? "confirmed" : "pending",
    amountMinor: record.amountMinor,
    currency: record.currency,
    expiresAt: record.initiation.expiresAt,
    failureMessage: null,
    sessionReference: confirmed ? record.sessionReference : undefined,
    canClaimLockerPin: confirmed,
  };
}

export function mockClaimAccessCode(
  sessionReference: string,
  flowToken: string,
): AccessCodeClaim {
  const record = [...payments.values()].find(
    (item) => item.sessionReference === sessionReference,
  );
  if (!record || record.initiation.customerFlowToken !== flowToken) {
    throw notFound();
  }
  if (record.accessCodeClaimed) {
    throw alreadyClaimed();
  }
  record.accessCodeClaimed = true;
  return {
    sessionReference,
    lockerNumber: 3,
    portNumber: 1,
    accessCode: String(Math.floor(1000 + (Date.now() % 9000))),
    chargingDurationSeconds: record.packageId === "STANDARD-500" ? 2700 : 900,
    accessCodeExpiresAt: new Date(
      Date.now() + ACCESS_CODE_TTL_MS,
    ).toISOString(),
    instructions: [
      "Enter this code on the charging machine keypad.",
      "Place the phone inside the displayed locker.",
      "Keep the code private because it will be required to retrieve the phone.",
    ],
  };
}

export function mockGetSessionStatus(
  sessionReference: string,
  flowToken: string,
): SessionStatus {
  const record = [...payments.values()].find(
    (item) => item.sessionReference === sessionReference,
  );
  const session = sessions.get(sessionReference);
  if (
    !record ||
    !session ||
    record.initiation.customerFlowToken !== flowToken
  ) {
    throw notFound();
  }
  const durationSeconds = record.packageId === "STANDARD-500" ? 2700 : 900;
  const elapsedSeconds = record.accessCodeClaimed
    ? Math.floor((Date.now() - session.startedAt) / 1000)
    : 0;
  const status = record.accessCodeClaimed ? "active" : "pending";
  return {
    sessionReference,
    status,
    lockerNumber: 3,
    portNumber: 1,
    stationName: "DIT Main Station",
    deviceName: "Smart Mobile Charger",
    packageName:
      record.packageId === "STANDARD-500" ? "Standard Charge" : "Quick Charge",
    amountPaid: record.amountMinor,
    currency: record.currency,
    purchasedDurationSeconds: durationSeconds,
    remainingSeconds: record.accessCodeClaimed
      ? Math.max(durationSeconds - elapsedSeconds, 0)
      : durationSeconds,
    startedAt: record.accessCodeClaimed
      ? new Date(session.startedAt).toISOString()
      : null,
    expectedEndAt: record.accessCodeClaimed
      ? new Date(session.startedAt + durationSeconds * 1000).toISOString()
      : null,
    endedAt: null,
    guidance: record.accessCodeClaimed ? "charging" : "payment_confirmed",
  };
}

function invalidCheckout() {
  return {
    kind: "invalid-qr" as const,
    title: "Checkout expired",
    message: "Scan the machine QR code again to start a new checkout.",
  };
}

function notFound() {
  return {
    kind: "unknown" as const,
    title: "Payment not found",
    message: "We could not find this payment. Scan the QR code again.",
  };
}

function alreadyClaimed() {
  return {
    kind: "unknown" as const,
    title: "Access code already generated",
    message:
      "This code was already generated for this payment. Check the device you used, or ask station support.",
  };
}
