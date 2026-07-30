import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const steps = [
  "Select package",
  "Make payment",
  "Open locker",
  "Charging",
  "Collect phone",
];

export function ProgressStepper({ current }: { current: number }) {
  return (
    <ol className="mb-5 grid grid-cols-5 gap-1" aria-label="Charging progress">
      {steps.map((step, index) => {
        const active = index <= current;
        return (
          <li key={step} className="grid gap-1 text-center">
            <span
              className={cn(
                "mx-auto grid size-8 place-items-center rounded-full border text-xs font-bold",
                active ? "bg-primary text-primary-foreground" : "bg-card",
              )}
            >
              {index < current ? <Check size={14} /> : index + 1}
            </span>
            <span className="text-[0.68rem] font-medium leading-tight text-muted-foreground">
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
