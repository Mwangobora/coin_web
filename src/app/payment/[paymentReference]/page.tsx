import { CustomerShell } from "@/features/public-charging/components/customer-shell";
import { PaymentStatusPage } from "@/features/public-charging/components/payment-status-page";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ paymentReference: string }>;
}) {
  const { paymentReference } = await params;
  return (
    <CustomerShell>
      <PaymentStatusPage paymentReference={paymentReference} />
    </CustomerShell>
  );
}
