"use client";

import { motion } from "motion/react";

import { AvailabilityCard } from "@/components/charging/availability-card";
import { CustomerSteps } from "@/components/charging/customer-steps";
import { DeviceStatusBadge } from "@/components/charging/device-status-badge";
import { StationSummaryCard } from "@/components/charging/station-summary-card";
import { DeviceUnavailableState } from "@/components/feedback/device-unavailable-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { CustomerHeader } from "@/components/layout/customer-header";
import { PageContainer } from "@/components/layout/page-container";
import { PackageSelectionList } from "@/features/charging-packages/components/package-selection-list";
import { invalidQrError, mapPublicError } from "@/lib/errors/public-error";

import { useQrResolution } from "../hooks/use-qr-resolution";
import { canSelectPackage, getCustomerDeviceState } from "./device-state";

export function QrDevicePage({ qrToken }: { qrToken: string }) {
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

  const state = getCustomerDeviceState(data);
  const packageDisabled = !canSelectPackage(state);
  const statusMessage = messageForDeviceState(state);

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-5"
      >
        <StationSummaryCard data={data} />
        <section className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Machine status</p>
              <h2 className="mt-1 break-words text-lg font-black">
                {data.device.name}
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {data.device.publicCode} · {data.device.connectivityStatus}
              </p>
            </div>
            <DeviceStatusBadge state={state} />
          </div>
          <p className="mt-4 rounded-xl bg-muted p-3 text-sm font-semibold leading-6">
            {statusMessage}
          </p>
        </section>
        <AvailabilityCard
          availableLockers={data.availability.availableLockers}
          availablePorts={data.availability.availablePorts}
        />
        <DeviceUnavailableState state={state} />
        <CustomerSteps />
        <PackageSelectionList
          packages={data.packages}
          disabled={packageDisabled}
          disabledReason={packageDisabled ? statusMessage : undefined}
        />
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

function messageForDeviceState(
  state: ReturnType<typeof getCustomerDeviceState>,
) {
  const messages = {
    available: "This charging machine is ready. Select your charging time.",
    limited: "A few lockers are available. Select your charging time now.",
    busy: "All lockers are currently occupied.",
    offline: "This charging machine is currently offline.",
    maintenance: "This machine is temporarily under maintenance.",
    fault: "This machine needs attention before it can charge phones.",
  };
  return messages[state];
}
