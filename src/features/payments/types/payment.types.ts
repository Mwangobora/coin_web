export type PaymentInitiation = {
  paymentReference: string;
  merchantReference: string;
  amountMinor: string;
  currency: string;
  provider: string;
  paymentInstructions: { qrReference: string };
  status: string;
  expiresAt: string;
  customerFlowToken: string;
};

export type PaymentStatus = {
  paymentReference: string;
  status: "pending" | "confirmed" | "failed" | "expired" | string;
  amountMinor: string;
  currency: string;
  expiresAt?: string | null;
  failureMessage: string | null;
  sessionReference?: string;
  canClaimLockerPin: boolean;
};

export type AccessCodeClaim = {
  sessionReference: string;
  lockerNumber: number;
  portNumber: number;
  accessCode: string;
  chargingDurationSeconds: number;
  accessCodeExpiresAt: string;
  instructions: string[];
};

export type SessionStatus = {
  sessionReference: string;
  status: string;
  lockerNumber: number;
  portNumber: number;
  stationName: string;
  deviceName: string;
  packageName: string;
  amountPaid: string;
  currency: string;
  purchasedDurationSeconds: number;
  remainingSeconds: number | null;
  startedAt: string | null;
  expectedEndAt: string | null;
  endedAt: string | null;
  guidance: string;
};
