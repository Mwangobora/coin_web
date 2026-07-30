export function EmptyState({
  title,
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-4">
      {title ? <p className="font-bold">{title}</p> : null}
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
