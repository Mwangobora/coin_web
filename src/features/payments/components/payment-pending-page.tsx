"use client";

import { LoaderCircle, QrCode, TriangleAlert } from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useEffect } from "react";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { CustomerHeader } from "@/components/layout/customer-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/formatters/charging-formatters";
import { readCheckoutFlow, saveSessionFlowToken } from "@/lib/storage/checkout-storage";
import { useStorageValue } from "@/lib/storage/use-storage-value";

import { formatCountdown, useCountdownSeconds } from "../hooks/use-countdown";
import { usePaymentStatus } from "../hooks/use-payment-status";

export function PaymentPendingPage({
  qrToken,
  paymentReference,
}: {
  qrToken: string;
  paymentReference: string;
}) {
  const router = useRouter();
  const flow = useStorageValue(() => readCheckoutFlow(paymentReference));

  const status = usePaymentStatus({
    paymentReference,
    customerFlowToken: flow?.customerFlowToken ?? null,
  });

  const secondsLeft = useCountdownSeconds(flow?.initiation.expiresAt);

  useEffect(() => {
    if (status.data?.status === "confirmed" && status.data.sessionReference && flow) {
      saveSessionFlowToken(status.data.sessionReference, flow.customerFlowToken);
      router.replace(
        `/charge/${qrToken}/session/${status.data.sessionReference}`,
      );
    }
  }, [status.data, qrToken, router, flow]);

  if (flow === undefined) {
    return (
      <Shell>
        <LoadingState
          title="Loading payment"
          message="Preparing your payment request."
        />
      </Shell>
    );
  }

  if (flow === null) {
    return (
      <Shell>
        <ErrorState
          title="Payment session not found"
          message="This payment link is no longer valid on this device. Scan the machine QR code again to start over."
          onRetry={() => router.push(`/charge/${qrToken}`)}
        />
      </Shell>
    );
  }

  const backendStatus = status.data?.status;
  const isTerminalFailure =
    backendStatus === "failed" || backendStatus === "expired";
  const isLocallyExpired = secondsLeft <= 0 && backendStatus !== "confirmed";

  if (isTerminalFailure || isLocallyExpired) {
    return (
      <Shell>
        <ErrorState
          title={
            backendStatus === "failed"
              ? "Payment failed"
              : "Payment window expired"
          }
          message={
            status.data?.failureMessage ??
            "Start a new payment request from the charging machine page."
          }
          onRetry={() => router.push(`/charge/${qrToken}`)}
        />
      </Shell>
    );
  }

  const { initiation } = flow;

  return (
    <Shell>
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4"
      >
        <div className="rounded-2xl bg-[#18181b] p-5 text-center text-white shadow-lg">
          <p className="text-sm font-bold text-orange-200">Amount due</p>
          <p className="mt-1 text-4xl font-black">
            {formatMoney(initiation.amountMinor, initiation.currency)}
          </p>
          <p className="mt-2 text-sm text-orange-100/80">
            Expires in {formatCountdown(secondsLeft)}
          </p>
        </div>

        <section className="grid justify-items-center gap-4 rounded-2xl border bg-card p-5 text-center shadow-sm">
          <p className="flex items-center gap-2 font-bold">
            <QrCode size={18} /> Scan to pay with {providerLabel(initiation.provider)}
          </p>
          <div className="rounded-xl border bg-white p-3">
            <QRCodeSVG
              value={initiation.paymentInstructions.qrReference}
              size={192}
              level="M"
            />
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Can&apos;t scan? Use your payment app&apos;s &ldquo;Enter
            reference&rdquo; option with:
          </p>
          <p className="rounded-lg bg-muted px-3 py-2 font-mono text-sm font-bold break-all">
            {initiation.merchantReference}
          </p>
        </section>

        <section
          className="flex items-center justify-center gap-3 rounded-2xl border bg-card p-4 text-sm font-semibold shadow-sm"
          aria-live="polite"
        >
          <LoaderCircle className="animate-spin text-primary" size={18} />
          Waiting for your payment to be confirmed...
        </section>

        {status.isError ? (
          <p className="flex items-center gap-2 text-center text-xs text-warning-foreground">
            <TriangleAlert size={14} /> Having trouble checking status. Still
            trying in the background.
          </p>
        ) : null}

        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push(`/charge/${qrToken}`)}
        >
          Cancel and choose again
        </Button>
      </motion.section>
    </Shell>
  );
}

function providerLabel(provider: string) {
  if (provider === "mock") return "your payment app";
  return provider.charAt(0).toUpperCase() + provider.slice(1);
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer>
      <CustomerHeader />
      {children}
    </PageContainer>
  );
}
