import { z } from "zod";

export const qrTokenSchema = z
  .string()
  .trim()
  .min(1)
  .max(256)
  .regex(/^[A-Za-z0-9_-]+$/);

export const chargingPackageSchema = z.object({
  publicPackageId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  priceMinor: z.string(),
  currency: z.string(),
  durationSeconds: z.number().int().positive(),
  displayOrder: z.number().int(),
  recommended: z.boolean().optional(),
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
    availableLockers: z.number().int().nonnegative(),
    availablePorts: z.number().int().nonnegative(),
  }),
  packages: z.array(chargingPackageSchema),
  checkoutToken: z.string(),
  expiresAt: z.string(),
});
