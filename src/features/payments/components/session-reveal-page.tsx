"use client";

import {
  BatteryCharging,
  CheckCircle2,
  KeyRound,
  TriangleAlert,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { CustomerHeader } from "@/components/layout/customer-header";
import { PageContainer } from "@/components/layout/page-container";
import type { AccessCodeClaim } from "@/features/payments/types/payment.types";
import { formatDuration } from "@/lib/formatters/charging-formatters";
import {
  readAccessCodeClaim,
  readSessionFlowToken,
  saveAccessCodeClaim,
} from "@/lib/storage/checkout-storage";
import { useStorageValue } from "@/lib/storage/use-storage-value";

import { useClaimAccessCode } from "../hooks/use-claim-access-code";
import { useSessionStatus } from "../hooks/use-session-status";

export function SessionRevealPage({
  qrToken,
  sessionReference,
}: {
  qrToken: string;
  sessionReference: string;
}) {
  const router = useRouter();
  const flowToken = useStorageValue(() =>
    readSessionFlowToken(sessionReference),
  );
  const claimFromStorage = useStorageValue(() =>
    readAccessCodeClaim(sessionReference),
  );
  const [freshClaim, setFreshClaim] = useState<AccessCodeClaim | null>(null);
  const claimAccessCode = useClaimAccessCode();
  const hasRequestedClaim = useRef(false);

  const storageChecked =
    flowToken !== undefined && claimFromStorage !== undefined;
  const claim = freshClaim ?? claimFromStorage ?? null;

  useEffect(() => {
    if (!storageChecked || claim || !flowToken || hasRequestedClaim.current) {
      return;
    }
    hasRequestedClaim.current = true;
    claimAccessCode.mutate(
      { sessionReference, customerFlowToken: flowToken },
      {
        onSuccess: (result) => {
          saveAccessCodeClaim(result);
          setFreshClaim(result);
        },
      },
    );
  }, [storageChecked, claim, flowToken, sessionReference, claimAccessCode]);

  const status = useSessionStatus({
    sessionReference,
    customerFlowToken: flowToken ?? null,
  });

  if (!storageChecked) {
    return (
      <Shell>
        <LoadingState
          title="Loading session"
          message="Preparing your charging session."
        />
      </Shell>
    );
  }

  if (!flowToken) {
    return (
      <Shell>
        <ErrorState
          title="Session not found"
          message="This charging session is not available on this device. Scan the machine QR code again to start over."
          onRetry={() => router.push(`/charge/${qrToken}`)}
        />
      </Shell>
    );
  }

  if (!claim && claimAccessCode.isError) {
    return (
      <Shell>
        <ErrorState
          title="Access code unavailable"
          message={errorMessage(claimAccessCode.error)}
          onRetry={() => router.push(`/charge/${qrToken}`)}
        />
      </Shell>
    );
  }

  if (!claim) {
    return (
      <Shell>
        <LoadingState
          title="Confirming payment"
          message="Generating your locker access code."
        />
      </Shell>
    );
  }

  const guidance = status.data?.guidance ?? "payment_confirmed";
  const remainingSeconds =
    status.data?.remainingSeconds ?? claim.chargingDurationSeconds;

  return (
    <Shell>
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4"
      >
        <div className="rounded-2xl bg-[#18181b] p-5 text-center text-white shadow-lg">
          <p className="flex items-center justify-center gap-2 text-sm font-bold text-orange-200">
            <KeyRound size={16} /> Your locker access code
          </p>
          <p className="mt-2 text-5xl font-black tracking-[0.2em]">
            {claim.accessCode}
          </p>
          <p className="mt-3 text-sm text-orange-100/80">
            Locker {claim.lockerNumber} · Port {claim.portNumber}
          </p>
        </div>

        <section className="rounded-2xl border bg-card p-4 shadow-sm">
          <p className="flex items-center gap-2 font-bold">
            <BatteryCharging size={18} /> {guidanceTitle(guidance)}
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {guidanceMessage(guidance)}
          </p>
          {guidance === "charging" || guidance === "connect_phone" ? (
            <p className="mt-3 text-sm font-semibold">
              Time remaining: {formatDuration(remainingSeconds)}
            </p>
          ) : null}
        </section>

        <section className="rounded-2xl border bg-card p-4 shadow-sm">
          <p className="font-bold">What to do</p>
          <ol className="mt-2 grid gap-2 text-sm leading-6 text-muted-foreground">
            {claim.instructions.map((instruction, index) => (
              <li key={instruction} className="flex gap-2">
                <CheckCircle2
                  className="mt-0.5 shrink-0 text-primary"
                  size={16}
                  aria-hidden="true"
                />
                <span>
                  {index + 1}. {instruction}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {guidance === "device_error" ? (
          <p className="flex items-center gap-2 text-center text-xs text-warning-foreground">
            <TriangleAlert size={14} /> Ask station support for help with this
            machine.
          </p>
        ) : null}
      </motion.section>
    </Shell>
  );
}

function guidanceTitle(guidance: string) {
  const titles: Record<string, string> = {
    payment_confirmed: "Payment confirmed",
    enter_access_code: "Enter your code",
    connect_phone: "Connecting",
    charging: "Charging",
    collect_phone: "Ready to collect",
    session_finished: "Session ended",
    device_error: "Machine needs attention",
  };
  return titles[guidance] ?? "Charging session";
}

function guidanceMessage(guidance: string) {
  const messages: Record<string, string> = {
    payment_confirmed: "Enter the code above on the charging machine keypad.",
    enter_access_code: "Enter the code above on the charging machine keypad.",
    connect_phone: "Place your phone inside the assigned locker.",
    charging: "Your phone is charging. Keep the locker closed.",
    collect_phone:
      "Charging is complete. Open the locker and collect your phone.",
    session_finished: "This charging session has ended.",
    device_error: "This machine needs attention before it can continue.",
  };
  return messages[guidance] ?? "";
}

function errorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Could not generate your access code. Try again.";
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer>
      <CustomerHeader />
      {children}
    </PageContainer>
  );
}
