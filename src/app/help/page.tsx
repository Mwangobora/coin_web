import { Coins, HelpCircle } from "lucide-react";

import { CustomerShell } from "@/features/public-charging/components/customer-shell";

const sections = [
  ["How to scan the QR", "Open your phone camera and tap the charging link."],
  [
    "How to select a package",
    "Choose one charging time. The price cannot be edited.",
  ],
  ["How to make payment", "Start mobile money payment and keep this tab open."],
  [
    "How to use the locker PIN",
    "Enter the four-digit PIN on the machine keypad.",
  ],
  [
    "How to connect the phone",
    "Put your phone inside the locker and connect the cable.",
  ],
  ["How to collect the phone", "Return and enter the same PIN saved earlier."],
  [
    "Payment stays pending",
    "Wait a little, then ask support if it does not change.",
  ],
  ["Device is offline", "Use another charger or coin payment if available."],
  ["Locker does not open", "Do not force it. Ask the station support contact."],
  ["Support contact", "Support phone placeholder: +255 000 000 000."],
];

export default function HelpPage() {
  return (
    <CustomerShell>
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
    </CustomerShell>
  );
}
