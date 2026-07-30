import { QrDevicePage } from "@/features/qr-resolution/components/qr-device-page";

export default async function ChargePage({
  params,
}: {
  params: Promise<{ qrToken: string }>;
}) {
  const { qrToken } = await params;
  return <QrDevicePage qrToken={qrToken} />;
}
