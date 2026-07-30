"use client";

import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { formatMoneyTZS, formatTime } from "@/lib/formatters";

import { getPaymentFlow } from "../api/public-flow-storage";
import { usePaymentStatus } from "../hooks/use-public-charging";
import { isPaymentTerminal, paymentCopy } from "../lib/status-copy";
import { ProgressStepper } from "./progress-stepper";
import { ErrorCard, LoadingCard } from "./state-card";

export function PaymentStatusPage({
  paymentReference,
}: {
  paymentReference: string;
}) {
  const [flowToken] = useState(() =>
    typeof window === "undefined" ? null : getPaymentFlow(paymentReference),
  );
  const query = usePaymentStatus(paymentReference, flowToken);
  const data = query.data;

  if (!flowToken) {
    return (
      <ErrorCard
        title="Payment session expired"
        message="Please return to the QR code and start again."
      />
    );
  }
  if (query.isLoading) return <LoadingCard title="Checking payment" />;
  if (query.isError || !data) {
    return (
      <ErrorCard title="Payment unavailable" message="Please try again." />
    );
  }

  const confirmed = data.status === "confirmed" && data.sessionReference;
  const failed = isPaymentTerminal(data.status) && !confirmed;

  return (
    <section className="grid gap-4">
      <ProgressStepper current={confirmed ? 2 : 1} />
      <div className="rounded-lg bg-card p-5 text-center shadow-sm">
        {confirmed ? (
          <CheckCircle2 className="mx-auto text-green-600" size={42} />
        ) : failed ? (
          <XCircle className="mx-auto text-destructive" size={42} />
        ) : (
          <Loader2 className="mx-auto animate-spin text-primary" size={42} />
        )}
        <h1 className="mt-3 text-2xl font-black">{paymentCopy(data.status)}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {confirmed
            ? "Your locker is reserved."
            : "Keep this page open while payment completes."}
        </p>
      </div>
      <div className="rounded-lg border bg-card p-4">
        <Info label="Amount" value={formatMoneyTZS(data.amountMinor)} />
        <Info label="Reference" value={data.paymentReference} />
        <Info label="Expires" value={formatTime(data.expiresAt)} />
      </div>
      {data.failureMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          {data.failureMessage}
        </div>
      ) : null}
      {confirmed ? (
        <Button asChild size="lg" className="w-full">
          <Link
            href={`/session/${encodeURIComponent(data.sessionReference ?? "")}`}
          >
            Open locker PIN
          </Link>
        </Button>
      ) : null}
    </section>
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
