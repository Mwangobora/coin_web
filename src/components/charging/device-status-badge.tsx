import type { CustomerDeviceState } from "@/features/qr-resolution/types/qr-resolution.types";
import { cn } from "@/lib/utils";

export function DeviceStatusBadge({ state }: { state: CustomerDeviceState }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-full px-3 text-sm font-bold",
        classNameFor(state),
      )}
    >
      {labelFor(state)}
    </span>
  );
}

function labelFor(state: CustomerDeviceState) {
  const labels: Record<CustomerDeviceState, string> = {
    available: "Available",
    limited: "Limited availability",
    busy: "Busy",
    offline: "Offline",
    maintenance: "Maintenance",
    fault: "Fault",
  };
  return labels[state];
}

function classNameFor(state: CustomerDeviceState) {
  if (state === "available") return "bg-green-100 text-green-800";
  if (state === "limited") return "bg-yellow-100 text-yellow-900";
  if (state === "offline" || state === "fault")
    return "bg-red-100 text-red-800";
  return "bg-orange-100 text-orange-900";
}
