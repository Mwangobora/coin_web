"use client";

import { CheckCircle2, CreditCard, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PrimaryCustomerButton } from "@/components/common/primary-customer-button";
import { EmptyState } from "@/components/feedback/empty-state";
import { useInitiatePayment } from "@/features/payments/hooks/use-initiate-payment";
import type { PublicPaymentMethod } from "@/features/payments/types/payment.types";
import { formatMoney } from "@/lib/formatters/charging-formatters";
import { saveCheckoutFlow } from "@/lib/storage/checkout-storage";

import type { ChargingPackage } from "../types/charging-package.types";
import { ChargingPackageCard } from "./charging-package-card";

const paymentMethods: Array<{ value: PublicPaymentMethod; label: string }> = [
  { value: "mpesa", label: "M-Pesa" },
  { value: "mixx_by_yas", label: "Mixx by Yas" },
  { value: "airtel_money", label: "Airtel Money" },
  { value: "halopesa", label: "HaloPesa" },
];

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
  const [selectedId, setSelectedId] = useState<string>();
  const [paymentMethod, setPaymentMethod] =
    useState<PublicPaymentMethod | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const initiatePayment = useInitiatePayment();
  const selected = packages.find((item) => item.publicPackageId === selectedId);

  const handlePay = () => {
    if (!selected || !paymentMethod) return;
    initiatePayment.mutate(
      {
        checkoutToken,
        packageId: selected.publicPackageId,
        idempotencyKey,
        paymentMethod,
      },
      {
        onSuccess: (initiation) => {
          saveCheckoutFlow({ ...initiation, provider: paymentMethod });
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
          Select amount to pay
        </h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          Choose TZS 200 or TZS 500 to continue.
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
              setPaymentMethod(null);
              toast.success(`${item.name} selected.`);
            }}
          />
        ))}
      </div>
      {selected ? (
        <section className="rounded-2xl border bg-card p-4 shadow-sm">
          <h3 className="text-lg font-black">Select payment method</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Choose the mobile money service you want to use.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {paymentMethods.map((method) => (
              <button
                key={method.value}
                type="button"
                aria-pressed={paymentMethod === method.value}
                onClick={() => {
                  setPaymentMethod(method.value);
                  toast.success(`${method.label} selected.`);
                }}
                className="flex min-h-14 w-full items-center justify-between rounded-xl border bg-muted px-4 text-left text-sm font-bold transition hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-pressed:border-primary aria-pressed:bg-primary/10"
              >
                <span className="flex items-center gap-3">
                  <Smartphone className="text-primary" size={20} />
                  {method.label}
                </span>
                {paymentMethod === method.value ? (
                  <CheckCircle2 className="text-primary" size={20} />
                ) : null}
              </button>
            ))}
          </div>
        </section>
      ) : null}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 px-3 py-3 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] backdrop-blur supports-[padding:max(0px)]:pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:static sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:shadow-none sm:backdrop-blur-none">
        <div className="mx-auto max-w-xl sm:max-w-none">
          {disabled && disabledReason ? (
            <p className="mb-2 text-center text-xs font-semibold text-warning-foreground">
              {disabledReason}
            </p>
          ) : null}
          <PrimaryCustomerButton
            disabled={
              disabled ||
              !selectedId ||
              !paymentMethod ||
              initiatePayment.isPending
            }
            onClick={handlePay}
            className="shadow-lg shadow-primary/25"
          >
            <CreditCard size={20} />
            {initiatePayment.isPending
              ? "Processing payment..."
              : selected && paymentMethod
                ? `Pay ${formatMoney(selected.priceMinor, selected.currency)}`
                : selected
                  ? "Select payment method"
                  : "Select amount"}
          </PrimaryCustomerButton>
        </div>
      </div>
    </section>
  );
}
