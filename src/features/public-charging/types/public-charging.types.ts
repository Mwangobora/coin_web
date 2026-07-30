export type PublicPackage = {
  publicPackageId: string;
  name: string;
  description: string | null;
  priceMinor: string;
  currency: string;
  durationSeconds: number;
  displayOrder: number;
};

export type QrResolution = {
  station: { name: string; region: string; district: string | null };
  device: {
    publicCode: string;
    name: string;
    status: "available" | "busy" | "maintenance" | string;
    connectivityStatus: "online" | "offline" | string;
  };
  availability: { availableLockers: number; availablePorts: number };
  packages: PublicPackage[];
  checkoutToken: string;
  expiresAt: string;
};

export type PaymentInitiation = {
  paymentReference: string;
  merchantReference: string;
  amountMinor: string;
  currency: string;
  provider: string;
  paymentInstructions: Record<string, unknown>;
  status: string;
  expiresAt: string;
  customerFlowToken: string;
};

export type PaymentStatus = {
  paymentReference: string;
  status: string;
  amountMinor: string;
  currency: string;
  expiresAt?: string | null;
  failureMessage?: string | null;
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

export type PublicSession = {
  sessionReference: string;
  status: string;
  lockerNumber: number;
  portNumber: number;
  stationName: string;
  deviceName: string;
  packageName: string;
  amountPaidMinor: string;
  currency: string;
  purchasedDurationSeconds: number;
  remainingSeconds: number;
  startedAt?: string | null;
  expectedEndAt?: string | null;
  endedAt?: string | null;
  guidance: string;
};
