import { ArrowRight, CircleHelp, QrCode, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { CustomerHeader } from "@/components/layout/customer-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

const steps = [
  "Scan the QR code on the machine.",
  "Choose how long you want to charge.",
  "Pay and get your locker PIN.",
  "Collect your phone when charging is complete.",
];

export default function HomePage() {
  return (
    <PageContainer>
      <CustomerHeader />
      <section className="grid gap-4 lg:gap-8">
        <div className="rounded-2xl bg-[#18181b] p-5 text-white shadow-lg min-[390px]:p-6 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:p-10">
          <div className="lg:max-w-md">
            <QrCode
              className="mb-4 text-orange-200 lg:hidden"
              size={40}
              aria-hidden="true"
            />
            <p className="text-sm font-bold text-orange-200">
              Charge your phone securely
            </p>
            <h1 className="mt-2 text-3xl fon
            -black leading-tight lg:text-5xl">
             Mobile phone Charging System
            </h1>


            <p className="mt-3 text-base leading-7 text-orange-100">
              Scan the QR code on the charging machine, choose your charging
              time, and pay from your phone.
            </p>
            <Button asChild className="mt-6 w-full lg:w-auto" size="lg">
              <Link href="/charge/DEMO-CHARGER-ONLINE">
                Start charging <ArrowRight size={19} />
              </Link>
            </Button>
          </div>
          <QrCode
            className="hidden text-orange-200 lg:block lg:size-40 lg:shrink-0"
            size={40}
            aria-hidden="true"
          />
        </div>
        <section className="rounded-2xl border bg-card p-5 shadow-sm lg:p-8">
          <h2 className="flex items-center gap-2 text-xl font-black">
            <ShieldCheck size={21} /> How it works
          </h2>
          <ol className="mt-4 grid gap-3 text-sm leading-6 text-muted-foreground sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {steps.map((step, index) => (
              <li key={step} className="flex gap-3 lg:flex-col lg:gap-2">
                <span className="bg-accent text-accent-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-black">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
        <Button
          asChild
          variant="outline"
          className="w-full lg:mx-auto lg:w-auto lg:px-10"
        >
          <Link href="/help">
            <CircleHelp size={18} /> Need help?
          </Link>
        </Button>
      </section>
      <footer className="text-muted-foreground mt-10 mb-4 text-center text-xs">
        Smart Charging System · Secure mobile charging network
      </footer>
    </PageContainer>
  );
}
