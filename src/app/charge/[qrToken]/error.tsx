"use client";

import { ErrorState } from "@/components/feedback/error-state";
import { CustomerHeader } from "@/components/layout/customer-header";
import { PageContainer } from "@/components/layout/page-container";

export default function ChargeError({ reset }: { reset: () => void }) {
  return (
    <PageContainer>
      <CustomerHeader />
      <ErrorState
        title="Charging page unavailable"
        message="We could not load this charging machine."
        onRetry={reset}
      />
    </PageContainer>
  );
}
