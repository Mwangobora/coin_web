import { QrDevicePage } from "@/features/qr-resolution/components/qr-device-page";

export default async function ChargePage({
  params,
  searchParams,
}: {
  params: Promise<{ qrToken: string }>;
  searchParams: Promise<{ start?: string }>;
}) {
  const { qrToken } = await params;
  const { start } = await searchParams;
  const autoStart = start === "1" || start === "true";

  return <QrDevicePage qrToken={qrToken} autoStart={autoStart} />;
}
