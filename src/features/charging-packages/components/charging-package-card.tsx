"use client";

import { CheckCircle2, Clock3, Sparkles } from "lucide-react";
import { motion } from "motion/react";

import {
  formatDuration,
  formatMoney,
} from "@/lib/formatters/charging-formatters";
import { cn } from "@/lib/utils";

import type { ChargingPackage } from "../types/charging-package.types";

export function ChargingPackageCard({
  item,
  selected,
  disabled,
  onSelect,
}: {
  item: ChargingPackage;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onSelect}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      className={cn(
        "min-h-32 w-full rounded-2xl border bg-card p-4 text-left shadow-sm transition",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        selected && "border-primary bg-accent ring-2 ring-primary/20",
        disabled && "cursor-not-allowed opacity-55",
        !disabled && "hover:border-primary hover:shadow-md",
      )}
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="block text-base font-black">{item.name}</span>
          {item.description ? (
            <span className="mt-1 block text-sm text-muted-foreground">
              {item.description}
            </span>
          ) : null}
        </span>
        {selected ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-black text-white">
            <CheckCircle2 size={15} /> Selected
          </span>
        ) : null}
      </span>
      <span className="mt-4 flex items-end justify-between gap-3">
        <span className="text-3xl font-black">
          {formatMoney(item.priceMinor, item.currency)}
        </span>
        {item.recommended ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-accent-foreground">
            <Sparkles size={13} /> Recommended
          </span>
        ) : null}
      </span>
      <span className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Clock3 size={16} /> {formatDuration(item.durationSeconds)}
      </span>
    </motion.button>
  );
}
