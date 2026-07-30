import { Loader2 } from "lucide-react";

export function LoadingState({
  title = "Loading charger",
  message = "Checking machine status and available packages.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <section
      className="grid min-h-64 place-items-center rounded-lg border bg-card p-6 text-center"
      aria-busy="true"
    >
      <div className="grid gap-3">
        <Loader2 className="mx-auto animate-spin text-primary" size={30} />
        <h1 className="text-xl font-black">{title}</h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </section>
  );
}
