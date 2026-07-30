import { CustomerShell } from "@/features/public-charging/components/customer-shell";
import { QrEntryPage } from "@/features/public-charging/components/qr-entry-page";

export default async function ChargePage({
  params,
}: {
  params: Promise<{ qrToken: string }>;
}) {
  const { qrToken } = await params;
  return (
    <CustomerShell>
      <QrEntryPage qrToken={qrToken} />
    </CustomerShell>
  );
}
