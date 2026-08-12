"use client";

import { ArrowRight, PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

import { CustomerSteps } from "@/components/charging/customer-steps";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { CustomerHeader } from "@/components/layout/customer-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { PackageSelectionList } from "@/features/charging-packages/components/package-selection-list";
import { invalidQrError, mapPublicError } from "@/lib/errors/public-error";

import { useQrResolution } from "../hooks/use-qr-resolution";

export function QrDevicePage({
  qrToken,
  autoStart = false,
}: {
  qrToken: string;
  autoStart?: boolean;
}) {
  const [hasStarted, setHasStarted] = useState(autoStart);
  const { data, error, isError, isLoading, isTokenValid, refetch } =
    useQrResolution(qrToken);

  if (!isTokenValid) {
    const publicError = invalidQrError();
    return (
      <Shell>
        <ErrorState {...publicError} />
      </Shell>
    );
  }

  if (isLoading) {
    return (
      <Shell>
        <LoadingState title="Loading charger availability" />
      </Shell>
    );
  }

  if (isError || !data) {
    const publicError = mapPublicError(error);
    return (
      <Shell>
        <ErrorState {...publicError} onRetry={() => void refetch()} />
      </Shell>
    );
  }

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-5"
      >
        <CustomerSteps />
        {hasStarted ? (
          <PackageSelectionList
            qrToken={qrToken}
            checkoutToken={data.checkoutToken}
            packages={data.packages}
            disabled={false}
          />
        ) : (
          <section className="rounded-2xl border bg-card p-5 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-bold text-primary">
              <PlayCircle size={18} /> Ready to charge?
            </p>
            <h2 className="mt-2 text-2xl font-black leading-tight">
              Start charging from this machine
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Tap start, choose TZS 200 or TZS 500, then pay using Fake Money.
            </p>
            <Button
              className="mt-5 w-full"
              size="lg"
              onClick={() => {
                setHasStarted(true);
                toast.success("Charging started. Select your charging time.");
              }}
            >
              Start charging <ArrowRight size={19} />
            </Button>
          </section>
        )}
      </motion.div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer>
      <CustomerHeader />
      {children}
    </PageContainer>
  );
}
