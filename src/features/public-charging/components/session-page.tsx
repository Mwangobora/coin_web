"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatDuration, formatMoneyTZS, formatTime } from "@/lib/formatters";

import { getPaymentFlow } from "../api/public-flow-storage";
import {
  useClaimAccessCode,
  useSessionStatus,
} from "../hooks/use-public-charging";
import { sessionCopy } from "../lib/status-copy";
import type { AccessCodeClaim } from "../types/public-charging.types";
import { AccessCodePanel } from "./access-code-panel";
import { ProgressStepper } from "./progress-stepper";
import { ErrorCard, LoadingCard } from "./state-card";

export function SessionPage({
  sessionReference,
}: {
  sessionReference: string;
}) {
  const [flowToken] = useState(() => findFlowToken());
  const [claim, setClaim] = useState<AccessCodeClaim | null>(null);
  const [pinSaved, setPinSaved] = useState(false);
  const session = useSessionStatus(sessionReference, flowToken);
  const claimMutation = useClaimAccessCode();

  async function showPin() {
    if (!flowToken) return;
    setClaim(await claimMutation.mutateAsync({ sessionReference, flowToken }));
  }

  if (!flowToken) {
    return (
      <ErrorCard
        title="Session expired"
        message="Please use the original browser tab from payment."
      />
    );
  }
  if (session.isLoading) return <LoadingCard title="Loading session" />;
  if (session.isError || !session.data) {
    return (
      <ErrorCard title="Session unavailable" message="Please try again." />
    );
  }
  if (claim && !pinSaved) {
    return <AccessCodePanel claim={claim} onSaved={() => setPinSaved(true)} />;
  }

  return (
    <section className="grid gap-4">
      <ProgressStepper current={session.data.status === "completed" ? 4 : 3} />
      <div className="rounded-lg bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-black">
          {sessionCopy(session.data.status)}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {session.data.guidance}
        </p>
      </div>
      {!session.data.startedAt && !pinSaved ? (
        <div className="rounded-lg border border-warning/40 bg-yellow-50 p-4">
          <p className="font-bold">Ready to open your locker?</p>
          <p className="mt-2 text-sm">
            The PIN will be shown once. Save it before leaving this page.
          </p>
          <Button className="mt-4 w-full" onClick={showPin}>
            {claimMutation.isPending ? "Preparing PIN..." : "Show my PIN"}
          </Button>
        </div>
      ) : null}
      <SessionDetails session={session.data} />
    </section>
  );
}

function SessionDetails({
  session,
}: {
  session: NonNullable<ReturnType<typeof useSessionStatus>["data"]>;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <Info label="Station" value={session.stationName} />
      <Info label="Device" value={session.deviceName} />
      <Info label="Locker" value={`Locker ${session.lockerNumber}`} />
      <Info label="Port" value={`Port ${session.portNumber}`} />
      <Info
        label="Duration"
        value={formatDuration(session.purchasedDurationSeconds)}
      />
      <Info
        label="Remaining"
        value={formatDuration(session.remainingSeconds)}
      />
      <Info label="Complete by" value={formatTime(session.expectedEndAt)} />
      <Info label="Paid" value={formatMoneyTZS(session.amountPaidMinor)} />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <p className="flex justify-between gap-4 border-b py-3 last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-bold">{value}</span>
    </p>
  );
}

function findFlowToken() {
  if (typeof window === "undefined") return null;
  for (let index = 0; index < sessionStorage.length; index += 1) {
    const key = sessionStorage.key(index);
    if (key?.startsWith("charging.customer.flow.")) {
      return getPaymentFlow(key.replace("charging.customer.flow.", ""));
    }
  }
  return null;
}
