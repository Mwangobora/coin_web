export function EmptyState({
  title,
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      {title ? <p className="font-bold">{title}</p> : null}
      <p className="text-sm leading-6 text-muted-foreground">{message}</p>
    </div>
  );
}
