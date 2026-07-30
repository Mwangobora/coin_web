export function paymentCopy(status?: string) {
  if (status === "confirmed") return "Payment confirmed";
  if (status === "failed") return "Payment failed";
  if (status === "expired") return "Payment expired";
  if (status === "cancelled") return "Payment cancelled";
  if (status === "refunded") return "Payment refunded";
  return "Waiting for payment";
}

export function isPaymentTerminal(status?: string) {
  return !!status && terminalPaymentStatuses.has(status);
}

export function sessionCopy(status?: string) {
  const map: Record<string, string> = {
    pending: "Enter PIN on the machine",
    awaiting_device: "Preparing your locker",
    active: "Charging started",
    paused: "Charging paused",
    completed: "Charging complete",
    stopped: "Session finished",
    failed: "Device problem",
    cancelled: "Session finished",
    expired: "Session finished",
  };
  return map[status ?? ""] ?? "Preparing your locker";
}

export function canPay(input: {
  deviceStatus?: string;
  connectivityStatus?: string;
  availableLockers?: number;
  availablePorts?: number;
}) {
  return (
    input.deviceStatus === "available" &&
    input.connectivityStatus === "online" &&
    !!input.availableLockers &&
    !!input.availablePorts
  );
}

const terminalPaymentStatuses = new Set([
  "confirmed",
  "failed",
  "expired",
  "cancelled",
  "refunded",
]);
