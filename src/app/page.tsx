import { ArrowRight, CircleHelp, QrCode, ShieldCheck } from "lucide-react";
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
  const showDemoLinks = shouldShowDemoLinks();

  return (
    <PageContainer>
      <CustomerHeader />
      <section className="grid gap-4">
        <div className="rounded-2xl bg-[#172033] p-5 text-white shadow-lg min-[390px]:p-6">
          <QrCode className="mb-4 text-blue-200" size={40} />
          <p className="text-sm font-bold text-blue-100">
            Charge your phone securely
          </p>
          <h1 className="mt-2 text-3xl font-black leading-tight">
            Smart Charging System
          </h1>
          <p className="mt-3 text-base leading-7 text-blue-100">
            Scan the QR code on the charging machine, choose your charging time,
            and pay from your phone.
          </p>
          <Button asChild className="mt-6 w-full" size="lg">
            <Link href="/help">
              How it works <ArrowRight size={19} />
            </Link>
          </Button>
        </div>
        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <ShieldCheck size={21} /> How it works
          </h2>
          <ol className="mt-4 grid gap-3 text-sm leading-6 text-muted-foreground">
            <li>1. Scan the QR code on the machine.</li>
            <li>2. Choose how long you want to charge.</li>
            <li>3. Pay and get your locker PIN.</li>
            <li>4. Collect your phone when charging is complete.</li>
          </ol>
        </section>
        <Button asChild variant="outline" className="w-full">
          <Link href="/help">
            <CircleHelp size={18} /> Need help?
          </Link>
        </Button>
        {showDemoLinks ? (
          <section className="grid gap-2" aria-label="Development QR examples">
            {demoLinks.map(([label, href]) => (
              <Button key={href} asChild variant="outline" className="w-full">
                <Link href={href}>{label}</Link>
              </Button>
            ))}
          </section>
        ) : null}
      </section>
    </PageContainer>
  );
}

export function shouldShowDemoLinks(nodeEnv = process.env.NODE_ENV) {
  return nodeEnv !== "production";
}
