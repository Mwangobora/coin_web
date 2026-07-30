export type ChargingPackage = {
  publicPackageId: string;
  name: string;
  description: string | null;
  priceMinor: string;
  currency: string;
  durationSeconds: number;
  displayOrder: number;
  recommended?: boolean;
};
