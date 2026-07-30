import { DoorOpen, PlugZap } from "lucide-react";
import type { ReactNode } from "react";

export function AvailabilityCard({
  availableLockers,
  availablePorts,
}: {
  availableLockers: number;
  availablePorts: number;
}) {
  return (
    <section className="grid grid-cols-2 gap-3">
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
    <div className="rounded-lg border bg-card p-4">
      <div className="mb-2 text-primary">{icon}</div>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-sm text-muted-foreground">{label} available</p>
    </div>
  );
}
