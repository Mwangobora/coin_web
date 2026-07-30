import { AlertCircle } from "lucide-react";

import type { CustomerDeviceState } from "@/features/qr-resolution/types/qr-resolution.types";

export function DeviceUnavailableState({
  state,
}: {
  state: CustomerDeviceState;
}) {
  if (state === "available" || state === "limited") return null;
  return (
    <div className="rounded-2xl border border-warning/40 bg-yellow-50 p-4 text-sm leading-6 text-warning-foreground shadow-sm">
      <p className="flex items-center gap-2 font-bold">
        <AlertCircle size={18} /> {titleFor(state)}
      </p>
      <p className="mt-2">{messageFor(state)}</p>
    </div>
  );
}

function titleFor(state: CustomerDeviceState) {
  if (state === "offline") return "Machine offline";
  if (state === "maintenance") return "Under maintenance";
  if (state === "fault") return "Device problem";
  return "No charging slots";
}

function messageFor(state: CustomerDeviceState) {
  if (state === "offline") return "This charging machine is currently offline.";
  if (state === "maintenance") {
    return "This charging machine is temporarily under maintenance.";
  }
  if (state === "fault") return "This machine needs attention before charging.";
  return "All charging slots are currently occupied.";
}
