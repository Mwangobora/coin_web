import { Coins, HelpCircle } from "lucide-react";

import { CustomerHeader } from "@/components/layout/customer-header";
import { PageContainer } from "@/components/layout/page-container";

const sections = [
  ["How to scan the QR", "Open your phone camera and tap the charging link."],
  [
    "How to select a package",
    "Choose one charging time. The price cannot be edited.",
  ],
  [
    "When payment appears",
    "Payment will be connected in the next phase of this customer website.",
  ],
  [
    "How to connect the phone",
    "After payment is added, the charger will guide locker deposit steps.",
  ],
  [
    "Device is offline",
    "Use another available charging machine or ask station support.",
  ],
  ["No locker is available", "Wait for another customer to collect a phone."],
  ["Support contact", "Support phone placeholder: +255 000 000 000."],
];

export default function HelpPage() {
  return (
    <PageContainer>
      <CustomerHeader />
      <section className="grid gap-4">
        <div className="rounded-lg bg-card p-5 shadow-sm">
          <HelpCircle className="mb-3 text-primary" size={32} />
          <h1 className="text-3xl font-black">Help</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Quick steps for QR mobile charging.
          </p>
        </div>
        <div className="grid gap-3">
          {sections.map(([title, body]) => (
            <article key={title} className="rounded-lg border bg-card p-4">
              <h2 className="font-bold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <p className="flex items-center gap-2 font-bold text-blue-900">
            <Coins size={18} /> Coin payment
          </p>
          <p className="mt-2 text-sm text-blue-900">
            Coin users do not need this web application. Insert the supported
            coin directly into the machine and follow the LCD instructions.
          </p>
        </div>
      </section>
    </PageContainer>
  );
}
