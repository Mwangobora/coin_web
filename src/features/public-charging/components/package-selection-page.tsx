"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { checkoutStorageKey, saveSelection } from "../api/public-flow-storage";
import { usePackages } from "../hooks/use-public-charging";
import { useSessionStorageItem } from "../hooks/use-session-storage-value";
import type { PublicPackage } from "../types/public-charging.types";
import { ContinueButton, PackageCards } from "./package-cards";
import { ProgressStepper } from "./progress-stepper";
import { ErrorCard, LoadingCard } from "./state-card";

const formSchema = z.object({ packageId: z.string().min(1) });
type FormValues = z.infer<typeof formSchema>;

export function PackageSelectionPage({ qrToken }: { qrToken: string }) {
  const router = useRouter();
  const checkoutToken = useSessionStorageItem(checkoutStorageKey(qrToken));
  const packages = usePackages(checkoutToken);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { packageId: "" },
  });
  const selected = useWatch({ control: form.control, name: "packageId" });

  const packageMap = useMemo(
    () => new Map(packages.data?.map((item) => [item.publicPackageId, item])),
    [packages.data],
  );

  function selectPackage(item: PublicPackage) {
    form.setValue("packageId", item.publicPackageId, { shouldValidate: true });
  }

  function submit(values: FormValues) {
    const packageItem = packageMap.get(values.packageId);
    if (!packageItem) return;
    saveSelection({ qrToken, packageItem });
    router.push("/checkout");
  }

  if (!checkoutToken) {
    return (
      <ErrorCard
        title="Scan QR again"
        message="Your checkout link expired before package selection."
      />
    );
  }
  if (packages.isLoading) return <LoadingCard title="Loading packages" />;
  if (packages.isError || !packages.data) {
    return (
      <ErrorCard title="Packages unavailable" message="Please try again." />
    );
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} className="grid gap-4">
      <ProgressStepper current={0} />
      <section className="rounded-lg bg-card p-5 shadow-sm">
        <h1 className="text-2xl font-black">Choose your charging time</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Select one package. The amount is fixed by the service.
        </p>
      </section>
      <PackageCards
        packages={packages.data}
        selectedId={selected}
        onSelect={selectPackage}
      />
      <ContinueButton disabled={!selected} />
    </form>
  );
}
