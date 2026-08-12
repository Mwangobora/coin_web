import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

const steps = [
  "Select package",
  "Choose Fake Money",
  "Tap Pay",
  "Payment accepted",
];

export function CustomerSteps({ currentStep = 0 }: { currentStep?: number }) {
  return (
    <ol
      className="grid grid-cols-4 gap-1 rounded-2xl border bg-card p-2 shadow-sm"
      aria-label="Charging progress"
    >
      {steps.map((step, index) => (
        <li key={step} className="grid gap-1 text-center">
          <span
            className={cn(
              "mx-auto grid size-8 place-items-center rounded-full border text-xs font-black transition",
              index < currentStep && "border-green-600 bg-green-600 text-white",
              index === currentStep && "border-primary bg-primary text-white",
              index > currentStep && "bg-muted text-muted-foreground",
            )}
            aria-current={index === currentStep ? "step" : undefined}
          >
            {index < currentStep ? <Check size={15} /> : index + 1}
          </span>
          <span
            className={cn(
              "text-[0.62rem] font-semibold leading-tight min-[375px]:text-[0.68rem]",
              index === currentStep
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {step}
          </span>
        </li>
      ))}
    </ol>
  );
}
