import { CustomerShell } from "@/features/public-charging/components/customer-shell";
import { PackageSelectionPage } from "@/features/public-charging/components/package-selection-page";

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ qrToken: string }>;
}) {
  const { qrToken } = await params;
  return (
    <CustomerShell>
      <PackageSelectionPage qrToken={qrToken} />
    </CustomerShell>
  );
}
