import { z } from "zod";

export const paymentInitiationSchema = z.object({
  paymentReference: z.string(),
  merchantReference: z.string(),
  amountMinor: z.string(),
  currency: z.string(),
  provider: z.string(),
  paymentInstructions: z.object({ qrReference: z.string() }),
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
  failureMessage: z.string().nullable(),
  sessionReference: z.string().optional(),
  canClaimLockerPin: z.boolean(),
});

export const accessCodeClaimSchema = z.object({
  sessionReference: z.string(),
  lockerNumber: z.number().int(),
  portNumber: z.number().int(),
  accessCode: z.string(),
  chargingDurationSeconds: z.number().int(),
  accessCodeExpiresAt: z.string(),
  instructions: z.array(z.string()),
});

export const sessionStatusSchema = z.object({
  sessionReference: z.string(),
  status: z.string(),
  lockerNumber: z.number().int(),
  portNumber: z.number().int(),
  stationName: z.string(),
  deviceName: z.string(),
  packageName: z.string(),
  amountPaid: z.string(),
  currency: z.string(),
  purchasedDurationSeconds: z.number().int(),
  remainingSeconds: z.number().int().nullable(),
  startedAt: z.string().nullable(),
  expectedEndAt: z.string().nullable(),
  endedAt: z.string().nullable(),
  guidance: z.string(),
});
