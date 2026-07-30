import Link from "next/link";

import { CustomerHeader } from "@/components/layout/customer-header";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageContainer>
      <CustomerHeader />
      <section className="rounded-lg border bg-card p-6 text-center">
        <h1 className="text-2xl font-black">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Please scan the charging QR code again.
        </p>
        <Button asChild className="mt-6 w-full">
          <Link href="/help">Open help</Link>
        </Button>
      </section>
    </PageContainer>
  );
}
