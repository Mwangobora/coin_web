import type {
  CustomerDeviceState,
  QrResolution,
} from "../types/qr-resolution.types";

export function getCustomerDeviceState(
  data: QrResolution,
): CustomerDeviceState {
  const status = data.device.status.toLowerCase();
  const connectivity = data.device.connectivityStatus.toLowerCase();
  const hasLocker = data.availability.availableLockers > 0;
  const hasPort = data.availability.availablePorts > 0;

  if (connectivity !== "online") return "offline";
  if (status === "maintenance") return "maintenance";
  if (status === "fault") return "fault";
  if (!hasLocker || !hasPort) return "busy";
  if (
    data.availability.availableLockers === 1 ||
    data.availability.availablePorts === 1
  ) {
    return "limited";
  }
  return "available";
}

export function canSelectPackage(state: CustomerDeviceState) {
  return state === "available" || state === "limited";
}
