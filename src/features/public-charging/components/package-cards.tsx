"use client";

import { Clock, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatDuration, formatMoneyTZS } from "@/lib/formatters";
import { cn } from "@/lib/utils";

import type { PublicPackage } from "../types/public-charging.types";

export function PackageCards({
  packages,
  selectedId,
  onSelect,
  disabled,
}: {
  packages: PublicPackage[];
  selectedId?: string;
  onSelect: (item: PublicPackage) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid gap-3">
      {packages.map((item, index) => (
        <button
          key={item.publicPackageId}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(item)}
          className={cn(
            "rounded-lg border bg-card p-4 text-left shadow-sm transition",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            selectedId === item.publicPackageId &&
              "border-primary ring-2 ring-primary/20",
          )}
        >
          <span className="flex items-start justify-between gap-3">
            <span>
              <span className="block text-base font-bold">{item.name}</span>
              <span className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={15} /> {formatDuration(item.durationSeconds)}
              </span>
            </span>
            {index === 0 ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
                <Sparkles size={13} /> Recommended
              </span>
            ) : null}
          </span>
          <span className="mt-4 block text-3xl font-black">
            {formatMoneyTZS(item.priceMinor)}
          </span>
          {item.description ? (
            <span className="mt-2 block text-sm text-muted-foreground">
              {item.description}
            </span>
          ) : null}
        </button>
      ))}
      {packages.length === 0 ? (
        <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          No web payment packages are available for this machine.
        </div>
      ) : null}
    </div>
  );
}

export function ContinueButton({ disabled }: { disabled?: boolean }) {
  return (
    <Button type="submit" size="lg" className="mt-4 w-full" disabled={disabled}>
      Continue
    </Button>
  );
}
