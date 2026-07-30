import { AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LoadingCard({ title }: { title: string }) {
  return (
    <section className="grid min-h-64 place-items-center rounded-lg border bg-card p-6 text-center">
      <div className="grid gap-3">
        <Loader2 className="mx-auto animate-spin text-primary" size={28} />
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </section>
  );
}

export function ErrorCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <section className="rounded-lg border bg-card p-5 text-center">
      <AlertTriangle className="mx-auto mb-3 text-destructive" size={32} />
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      <Button asChild className="mt-5 w-full">
        <Link href="/help">Get help</Link>
      </Button>
    </section>
  );
}
