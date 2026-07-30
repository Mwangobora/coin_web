import { MapPin } from "lucide-react";

import type { QrResolution } from "@/features/qr-resolution/types/qr-resolution.types";

export function StationSummaryCard({ data }: { data: QrResolution }) {
  return (
    <section className="rounded-lg bg-[#172033] p-5 text-white shadow-lg">
      <p className="text-sm text-blue-100">Charging at</p>
      <h1 className="mt-1 text-3xl font-black">{data.station.name}</h1>
      <p className="mt-3 flex items-center gap-2 text-sm text-blue-100">
        <MapPin size={16} />
        {data.station.region}
        {data.station.district ? `, ${data.station.district}` : ""}
      </p>
      <p className="mt-4 text-sm text-blue-50">
        {data.device.name} · {data.device.publicCode}
      </p>
    </section>
  );
}
