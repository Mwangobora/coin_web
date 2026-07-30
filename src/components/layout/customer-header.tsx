import { BatteryCharging, CircleHelp } from "lucide-react";
import Link from "next/link";

export function CustomerHeader() {
  return (
    <header className="mb-5 flex items-center justify-between">
      <Link href="/" className="flex min-h-12 items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-[#172033] text-white">
          <BatteryCharging size={22} aria-hidden="true" />
        </span>
        <span>
          <span className="block text-sm font-black">
            Smart Charging System
          </span>
          <span className="text-xs text-muted-foreground">
            Public customer access
          </span>
        </span>
      </Link>
      <Link
        href="/help"
        className="grid size-11 place-items-center rounded-full border bg-card"
        aria-label="Open help"
      >
        <CircleHelp size={20} aria-hidden="true" />
      </Link>
    </header>
  );
}
