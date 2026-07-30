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

  return (
    <Shell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-5"
      >
        <StationSummaryCard data={data} />
        <section className="rounded-lg border bg-card p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">Machine status</p>
              <h2 className="mt-1 text-lg font-black">{data.device.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {data.device.publicCode} · {data.device.connectivityStatus}
              </p>
            </div>
            <DeviceStatusBadge state={state} />
          </div>
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
