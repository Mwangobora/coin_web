import { DoorOpen, PlugZap } from "lucide-react";
import type { ReactNode } from "react";

export function AvailabilityCard({
  availableLockers,
  availablePorts,
}: {
  availableLockers: number;
  availablePorts: number;
}) {
  const lockerText =
    availableLockers === 1
      ? "1 charging locker is available."
      : `${availableLockers} charging lockers are available.`;

  return (
    <section className="grid gap-3" aria-live="polite">
      <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-green-900">
        <p className="font-black">{lockerText}</p>
        <p className="mt-1 text-sm leading-6">
          A locker will be assigned automatically after payment is confirmed.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Metric
          icon={<DoorOpen size={19} />}
          label="Lockers"
          value={availableLockers}
        />
        <Metric
          icon={<PlugZap size={19} />}
          label="Ports"
          value={availablePorts}
        />
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="mb-2 text-primary">{icon}</div>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-sm text-muted-foreground">{label} available</p>
    </div>
  );
}
