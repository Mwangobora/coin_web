export function LoadingState({
  title = "Loading charger",
  message = "Checking machine status and available packages.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <section
      className="rounded-2xl border bg-card p-5 shadow-sm"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="grid gap-4">
        <div>
          <h1 className="text-xl font-black">{title}</h1>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {message}
          </p>
        </div>
        <Skeleton className="h-28" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid gap-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    </section>
  );
}

function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-muted ${className}`}
      aria-hidden="true"
    />
  );
}
