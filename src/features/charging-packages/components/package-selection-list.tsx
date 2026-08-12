"use client";

import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PrimaryCustomerButton } from "@/components/common/primary-customer-button";
import { EmptyState } from "@/components/feedback/empty-state";
import { useInitiatePayment } from "@/features/payments/hooks/use-initiate-payment";
import { formatMoney } from "@/lib/formatters/charging-formatters";
import { saveCheckoutFlow } from "@/lib/storage/checkout-storage";

import type { ChargingPackage } from "../types/charging-package.types";
import { ChargingPackageCard } from "./charging-package-card";

export function PackageSelectionList({
  qrToken,
  checkoutToken,
  packages,
  disabled,
  disabledReason,
}: {
  qrToken: string;
  checkoutToken: string;
  packages: ChargingPackage[];
  disabled: boolean;
  disabledReason?: string;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(packages[0]?.publicPackageId);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const initiatePayment = useInitiatePayment();
  const selected = packages.find((item) => item.publicPackageId === selectedId);

  const handlePay = () => {
    if (!selected) return;
    initiatePayment.mutate(
      { checkoutToken, packageId: selected.publicPackageId, idempotencyKey },
      {
        onSuccess: (initiation) => {
          saveCheckoutFlow(initiation);
          router.push(`/charge/${qrToken}/pay/${initiation.paymentReference}`);
        },
        onError: (error) => {
          const message =
            error && typeof error === "object" && "message" in error
              ? String((error as { message: unknown }).message)
              : "Could not start payment. Try again.";
          toast.error(message);
        },
      },
    );
  };

  if (packages.length === 0) {
    return (
      <EmptyState
        title="No packages available"
        message="This charger has no customer packages configured yet."
      />
    );
  }

  return (
    <section className="grid gap-4 pb-24" aria-labelledby="packages-title">
      <div>
        <h2 id="packages-title" className="text-xl font-black">
          Select charging time
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Choose one option. Your locker will be assigned after payment.
        </p>
      </div>
      <div className="grid gap-3">
        {packages.map((item) => (
          <ChargingPackageCard
            key={item.publicPackageId}
            item={item}
            selected={selectedId === item.publicPackageId}
            disabled={disabled}
            onSelect={() => {
              setSelectedId(item.publicPackageId);
              toast.success(`${item.name} selected.`);
            }}
          />
        ))}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 px-3 py-3 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] backdrop-blur supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:static sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none sm:backdrop-blur-none">
        <div className="mx-auto max-w-xl sm:max-w-none">
          {disabled && disabledReason ? (
            <p className="mb-2 text-center text-xs font-semibold text-warning-foreground">
              {disabledReason}
            </p>
          ) : null}
          <PrimaryCustomerButton
            disabled={disabled || !selectedId || initiatePayment.isPending}
            onClick={handlePay}
            className="shadow-lg shadow-primary/25"
          >
            <CreditCard size={20} />
            {initiatePayment.isPending
              ? "Creating payment request..."
              : selected
                ? `Continue to payment · ${formatMoney(selected.priceMinor, selected.currency)}`
                : "Continue to payment"}
          </PrimaryCustomerButton>
        </div>
      </div>
    </section>
  );
}
