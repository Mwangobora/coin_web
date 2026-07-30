"use client";

import { CreditCard, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { formatDuration, formatMoneyTZS } from "@/lib/formatters";

import {
  getCheckout,
  parseSelection,
  savePaymentFlow,
  selectionStorageKey,
} from "../api/public-flow-storage";
import { useInitiatePayment } from "../hooks/use-public-charging";
import { useSessionStorageItem } from "../hooks/use-session-storage-value";
import { ProgressStepper } from "./progress-stepper";
import { ErrorCard } from "./state-card";

export function CheckoutPage() {
  const router = useRouter();
  const selectionRaw = useSessionStorageItem(selectionStorageKey);
  const selection = useMemo(() => parseSelection(selectionRaw), [selectionRaw]);
  const checkoutToken = useMemo(
    () => (selection ? getCheckout(selection.qrToken) : null),
    [selection],
  );
  const payment = useInitiatePayment();

  async function startPayment() {
    if (!selection || !checkoutToken) return;
    const result = await payment.mutateAsync({
      checkoutToken,
      packageId: selection.packageItem.publicPackageId,
      idempotencyKey: crypto.randomUUID(),
    });
    savePaymentFlow(result);
    router.push(`/payment/${encodeURIComponent(result.paymentReference)}`);
  }

  if (!selection || !checkoutToken) {
    return (
      <ErrorCard
        title="Checkout expired"
        message="Please scan the QR code and select a package again."
      />
    );
  }

  return (
    <section className="grid gap-4">
      <ProgressStepper current={1} />
      <div className="rounded-lg bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-black">Confirm payment</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The payment request will use the package amount shown here.
        </p>
      </div>
      <div className="rounded-lg border bg-card p-5">
        <p className="text-sm text-muted-foreground">Selected package</p>
        <h2 className="mt-1 text-xl font-bold">{selection.packageItem.name}</h2>
        <p className="mt-4 text-4xl font-black">
          {formatMoneyTZS(selection.packageItem.priceMinor)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatDuration(selection.packageItem.durationSeconds)} charging time
        </p>
      </div>
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm">
        <p className="flex gap-2 font-bold text-blue-900">
          <ShieldCheck size={18} /> Mobile money checkout
        </p>
        <p className="mt-2 text-blue-900">
          Follow the payment prompt or QR instructions. Keep this browser tab
          open.
        </p>
      </div>
      <Button
        size="lg"
        className="w-full"
        onClick={startPayment}
        disabled={payment.isPending}
      >
        <CreditCard size={18} />
        {payment.isPending ? "Starting payment..." : "Start payment"}
      </Button>
    </section>
  );
}
