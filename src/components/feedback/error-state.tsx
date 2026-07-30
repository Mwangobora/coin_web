import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ErrorState({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <section
      role="alert"
      className="rounded-2xl border bg-card p-5 text-center shadow-sm"
    >
      <AlertTriangle className="mx-auto mb-3 text-destructive" size={34} />
      <h1 className="text-2xl font-black">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button className="mt-5 w-full" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </section>
  );
}
