import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CustomerShell } from "@/features/public-charging/components/customer-shell";

export default function HomePage() {
  return (
    <CustomerShell>
      <section className="rounded-lg bg-card p-6 text-center shadow-sm">
        <h1 className="text-3xl font-black">Scan a charger QR code</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Use your phone camera to open the charging link printed on the
          machine.
        </p>
        <Button asChild className="mt-6 w-full" size="lg">
          <Link href="/help">How it works</Link>
        </Button>
      </section>
    </CustomerShell>
  );
}
