import { MapPin } from "lucide-react";

import type { QrResolution } from "@/features/qr-resolution/types/qr-resolution.types";

export function StationSummaryCard({ data }: { data: QrResolution }) {
  return (
    <section className="rounded-2xl bg-[#18181b] p-5 text-white shadow-lg">
      <p className="text-sm font-bold text-orange-200">You are charging at</p>
      <h1 className="mt-1 break-words text-3xl font-black leading-tight">
        {data.station.name}
      </h1>
      <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-orange-100">
        <MapPin className="mt-0.5 shrink-0" size={16} />
        <span>
          {data.station.region}
          {data.station.district ? `, ${data.station.district}` : ""}
        </span>
      </p>
      <p className="mt-4 text-sm text-orange-100/80">
        {data.device.name} · {data.device.publicCode}
      </p>
    </section>
  );
}
