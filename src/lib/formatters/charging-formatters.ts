export function formatMoney(priceMinor: string, currency: string) {
  const amount = Number.parseInt(priceMinor, 10);
  if (!Number.isFinite(amount)) return `${currency} ${priceMinor}`;
  return `${currency} ${new Intl.NumberFormat("en-TZ").format(amount)}`;
}

export function formatDuration(seconds: number) {
  const totalMinutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return pluralize(minutes, "minute");
  if (minutes === 0) return pluralize(hours, "hour");
  return `${pluralize(hours, "hour")} ${pluralize(minutes, "minute")}`;
}

function pluralize(value: number, unit: string) {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}
