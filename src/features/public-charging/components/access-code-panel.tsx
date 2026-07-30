"use client";

import { Copy, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { formatDuration, formatTime } from "@/lib/formatters";

import type { AccessCodeClaim } from "../types/public-charging.types";

export function AccessCodePanel({
  claim,
  onSaved,
}: {
  claim: AccessCodeClaim;
  onSaved: () => void;
}) {
  const [saved, setSaved] = useState(false);

  async function copyPin() {
    await navigator.clipboard.writeText(claim.accessCode);
    toast.success("PIN copied");
  }

  return (
    <section className="rounded-lg border bg-card p-5 text-center shadow-sm">
      <LockKeyhole className="mx-auto text-primary" size={36} />
      <p className="mt-3 text-sm text-muted-foreground">
        Locker {claim.lockerNumber}
      </p>
      <h1 className="mt-1 text-2xl font-black">Your locker PIN</h1>
      <p className="mt-4 rounded-lg bg-[#172033] px-4 py-5 font-mono text-5xl font-black tracking-[0.3em] text-white">
        {claim.accessCode}
      </p>
      <p className="mt-4 text-sm font-semibold text-warning-foreground">
        Take a screenshot or write down this PIN before continuing. It will not
        be shown again.
      </p>
      <div className="mt-4 grid gap-2 text-left text-sm text-muted-foreground">
        <p>Enter this PIN on the charging machine keypad.</p>
        <p>Use the same PIN later to collect your phone.</p>
        <p>Charging time: {formatDuration(claim.chargingDurationSeconds)}</p>
        <p>PIN expires: {formatTime(claim.accessCodeExpiresAt)}</p>
      </div>
      <Button variant="outline" className="mt-5 w-full" onClick={copyPin}>
        <Copy size={18} /> Copy PIN
      </Button>
      <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-lg border p-3 text-left text-sm">
        <input
          type="checkbox"
          checked={saved}
          onChange={(event) => setSaved(event.target.checked)}
          className="size-5"
        />
        I have saved this PIN safely.
      </label>
      <Button
        className="mt-3 w-full"
        size="lg"
        disabled={!saved}
        onClick={onSaved}
      >
        Continue
      </Button>
    </section>
  );
}
