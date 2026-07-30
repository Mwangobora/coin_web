import { BatteryCharging, CircleHelp } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function CustomerShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-xl px-4 py-4 sm:py-8">
      <header className="mb-5 flex items-center justify-between">
        <Link href="/help" className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
            <BatteryCharging size={22} aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-bold">Charge Link</span>
            <span className="text-xs text-muted-foreground">
              Public charging
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
      {children}
    </main>
  );
}
