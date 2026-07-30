import { z } from "zod";

export const qrTokenSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z0-9_-]{16,256}$/);
export const paymentReferenceSchema = z.string().trim().min(6).max(128);
export const sessionReferenceSchema = z.string().trim().min(6).max(128);

export const packageSchema = z.object({
  publicPackageId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  priceMinor: z.string(),
  currency: z.string(),
  durationSeconds: z.number(),
  displayOrder: z.number(),
});

export const qrResolutionSchema = z.object({
  station: z.object({
    name: z.string(),
    region: z.string(),
    district: z.string().nullable(),
  }),
  device: z.object({
    publicCode: z.string(),
    name: z.string(),
    status: z.string(),
    connectivityStatus: z.string(),
  }),
  availability: z.object({
    availableLockers: z.number(),
    availablePorts: z.number(),
  }),
  packages: z.array(packageSchema),
  checkoutToken: z.string(),
  expiresAt: z.string(),
});

export const paymentInitiationSchema = z.object({
  paymentReference: z.string(),
  merchantReference: z.string(),
  amountMinor: z.string(),
  currency: z.string(),
  provider: z.string(),
  paymentInstructions: z.record(z.string(), z.unknown()),
  status: z.string(),
  expiresAt: z.string(),
  customerFlowToken: z.string(),
});

export const paymentStatusSchema = z.object({
  paymentReference: z.string(),
  status: z.string(),
  amountMinor: z.string(),
  currency: z.string(),
  expiresAt: z.string().nullable().optional(),
  failureMessage: z.string().nullable().optional(),
  sessionReference: z.string().optional(),
  canClaimLockerPin: z.boolean(),
});

export const accessCodeClaimSchema = z.object({
  sessionReference: z.string(),
  lockerNumber: z.number(),
  portNumber: z.number(),
  accessCode: z.string().regex(/^\d{4}$/),
  chargingDurationSeconds: z.number(),
  accessCodeExpiresAt: z.string(),
  instructions: z.array(z.string()),
});

export const sessionSchema = z.object({
  sessionReference: z.string(),
  status: z.string(),
  lockerNumber: z.number(),
  portNumber: z.number(),
  stationName: z.string(),
  deviceName: z.string(),
  packageName: z.string(),
  amountPaidMinor: z.string(),
  currency: z.string(),
  purchasedDurationSeconds: z.number(),
  remainingSeconds: z.number(),
  startedAt: z.string().nullable().optional(),
  expectedEndAt: z.string().nullable().optional(),
  endedAt: z.string().nullable().optional(),
  guidance: z.string(),
});
