import type { ChargingPackage } from "@/features/charging-packages/types/charging-package.types";

export type CustomerDeviceState =
  "available" | "limited" | "busy" | "offline" | "maintenance" | "fault";

export type QrResolution = {
  station: {
    name: string;
    region: string;
    district: string | null;
  };
  device: {
    publicCode: string;
    name: string;
    status: string;
    connectivityStatus: string;
  };
  availability: {
    availableLockers: number;
    availablePorts: number;
  };
  packages: ChargingPackage[];
  checkoutToken: string;
  expiresAt: string;
};
