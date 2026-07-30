import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CustomerShell } from "@/features/public-charging/components/customer-shell";

export default function ErrorRoute() {
  return (
    <CustomerShell>
      <section className="rounded-lg border bg-card p-6 text-center">
        <h1 className="text-2xl font-black">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Please scan the QR code again or ask for support at the station.
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href="/help">Get help</Link>
        </Button>
      </section>
    </CustomerShell>
  );
}
