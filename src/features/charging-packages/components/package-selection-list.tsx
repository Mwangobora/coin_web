"use client";

import { CreditCard } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PrimaryCustomerButton } from "@/components/common/primary-customer-button";
import { EmptyState } from "@/components/feedback/empty-state";

import type { ChargingPackage } from "../types/charging-package.types";
import { ChargingPackageCard } from "./charging-package-card";

export function PackageSelectionList({
  packages,
  disabled,
}: {
  packages: ChargingPackage[];
  disabled: boolean;
}) {
  const [selectedId, setSelectedId] = useState(packages[0]?.publicPackageId);

  if (packages.length === 0) {
    return (
      <EmptyState
        title="No packages available"
        message="This charger has no customer packages configured yet."
      />
    );
  }

  return (
    <section className="grid gap-4" aria-labelledby="packages-title">
      <div>
        <h2 id="packages-title" className="text-xl font-black">
          Choose a charging package
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select one package. Prices are confirmed by the charging service.
        </p>
      </div>
      <div className="grid gap-3">
        {packages.map((item) => (
          <ChargingPackageCard
            key={item.publicPackageId}
            item={item}
            selected={selectedId === item.publicPackageId}
            disabled={disabled}
            onSelect={() => setSelectedId(item.publicPackageId)}
          />
        ))}
      </div>
      <PrimaryCustomerButton
        disabled={disabled || !selectedId}
        onClick={() =>
          toast.info("Payment integration will be connected in the next phase.")
        }
      >
        <CreditCard size={20} /> Continue to payment
      </PrimaryCustomerButton>
    </section>
  );
}
