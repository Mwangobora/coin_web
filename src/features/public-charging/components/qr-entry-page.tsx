"use client";

import { MapPin, PlugZap, Wifi, WifiOff } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { formatDuration, formatMoneyTZS } from "@/lib/formatters";

import { saveCheckout } from "../api/public-flow-storage";
import { useResolveQr } from "../hooks/use-public-charging";
import { canPay } from "../lib/status-copy";
import { ProgressStepper } from "./progress-stepper";
import { ErrorCard, LoadingCard } from "./state-card";

export function QrEntryPage({ qrToken }: { qrToken: string }) {
  const query = useResolveQr(qrToken);
  const data = query.data;

  useEffect(() => {
    if (data?.checkoutToken) saveCheckout(qrToken, data.checkoutToken);
  }, [data?.checkoutToken, qrToken]);

  if (query.isLoading) return <LoadingCard title="Checking this charger" />;
  if (query.isError || !data) {
    return (
      <ErrorCard
        title="QR code not available"
        message="Please scan the QR code again or ask for support nearby."
      />
    );
  }

  const ready = canPay({
    deviceStatus: data.device.status,
    connectivityStatus: data.device.connectivityStatus,
    availableLockers: data.availability.availableLockers,
    availablePorts: data.availability.availablePorts,
  });

  return (
    <section className="grid gap-4">
      <ProgressStepper current={0} />
      <div className="rounded-lg bg-[#172033] p-5 text-white shadow-lg">
        <p className="text-sm text-blue-100">You are charging at</p>
        <h1 className="mt-1 text-3xl font-black">{data.station.name}</h1>
        <p className="mt-3 flex items-center gap-2 text-sm text-blue-100">
          <MapPin size={16} /> {data.station.region}
          {data.station.district ? `, ${data.station.district}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Metric label="Lockers" value={data.availability.availableLockers} />
        <Metric label="Ports" value={data.availability.availablePorts} />
      </div>

      <div className="rounded-lg border bg-card p-4">
        <p className="flex items-center gap-2 font-bold">
          {data.device.connectivityStatus === "online" ? (
            <Wifi className="text-green-600" size={18} />
          ) : (
            <WifiOff className="text-destructive" size={18} />
          )}
          {data.device.name}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Status:{" "}
          {deviceMessage(data.device.status, data.device.connectivityStatus)}
        </p>
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h2 className="font-bold">Available packages</h2>
        <div className="mt-3 grid gap-2">
          {data.packages.slice(0, 3).map((item) => (
            <div
              key={item.publicPackageId}
              className="flex justify-between gap-3"
            >
              <span>{item.name}</span>
              <span className="font-bold">
                {formatMoneyTZS(item.priceMinor)} ·{" "}
                {formatDuration(item.durationSeconds)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {!ready ? <UnavailableReason /> : null}
      {ready ? (
        <Button asChild size="lg" className="w-full">
          <Link href={`/charge/${encodeURIComponent(qrToken)}/packages`}>
            Select package
          </Link>
        </Button>
      ) : (
        <Button size="lg" className="w-full" disabled>
          Select package
        </Button>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <PlugZap className="mb-2 text-primary" size={18} />
      <p className="text-3xl font-black">{value}</p>
      <p className="text-sm text-muted-foreground">{label} available</p>
    </div>
  );
}

function deviceMessage(status: string, connectivity: string) {
  if (connectivity !== "online") return "Offline";
  if (status === "maintenance") return "Under maintenance";
  if (status === "busy") return "No slot available";
  return "Ready";
}

function UnavailableReason() {
  return (
    <div className="rounded-lg border border-warning/40 bg-yellow-50 p-4 text-sm">
      This machine cannot start a web payment right now. Please try another
      charger or use coin payment if the machine supports it.
    </div>
  );
}
