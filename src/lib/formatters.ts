export function formatMoneyTZS(value: string | number) {
  return `TZS ${Number(value).toLocaleString("en-TZ")}`;
}

export function formatDuration(seconds: number) {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}

export function formatTime(value?: string | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en-TZ", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}
