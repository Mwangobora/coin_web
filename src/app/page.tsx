import { ArrowRight, QrCode, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { CustomerHeader } from "@/components/layout/customer-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

const demoLinks = [
  ["Online demo", "/charge/DEMO-CHARGER-ONLINE"],
  ["Offline demo", "/charge/DEMO-CHARGER-OFFLINE"],
  ["Maintenance demo", "/charge/DEMO-CHARGER-MAINTENANCE"],
];

export default function HomePage() {
  return (
    <PageContainer>
      <CustomerHeader />
      <section className="grid gap-5">
        <div className="rounded-lg bg-[#172033] p-6 text-white shadow-lg">
          <QrCode className="mb-5 text-blue-200" size={42} />
          <h1 className="text-3xl font-black">Smart Charging System</h1>
          <p className="mt-3 text-sm leading-6 text-blue-100">
            Scan the QR code displayed on the charging machine using your phone
            camera to begin.
          </p>
          <Button asChild className="mt-6 w-full" size="lg">
            <Link href="/help">
              How it works <ArrowRight size={19} />
            </Link>
          </Button>
        </div>
        <section className="rounded-lg border bg-card p-5">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <ShieldCheck size={21} /> How it works
          </h2>
          <ol className="mt-4 grid gap-3 text-sm text-muted-foreground">
            <li>1. Open the QR link from the physical charging machine.</li>
            <li>2. Check station, locker, and charging-port availability.</li>
            <li>3. Choose one charging package and continue when ready.</li>
          </ol>
        </section>
        <section className="grid gap-2" aria-label="Mock QR examples">
          {demoLinks.map(([label, href]) => (
            <Button key={href} asChild variant="outline" className="w-full">
              <Link href={href}>{label}</Link>
            </Button>
          ))}
        </section>
      </section>
    </PageContainer>
  );
}
