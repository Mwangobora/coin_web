import { BatteryCharging, CircleHelp } from "lucide-react";
import Link from "next/link";

export function CustomerHeader() {
  return (
    <header className="mb-4 flex items-center justify-between gap-3">
      <Link href="/" className="flex min-h-12 items-center gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#172033] text-white shadow-sm">
          <BatteryCharging size={22} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-black">
            Smart Charging System
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            Charge your phone securely
          </span>
        </span>
      </Link>
      <Link
        href="/help"
        className="grid size-11 shrink-0 place-items-center rounded-full border bg-card shadow-sm transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label="Open help"
      >
        <CircleHelp size={20} aria-hidden="true" />
      </Link>
    </header>
  );
}
