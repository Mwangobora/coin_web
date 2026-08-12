import { PaymentPendingPage } from "@/features/payments/components/payment-pending-page";

export default async function PayPage({
  params,
}: {
  params: Promise<{ qrToken: string; paymentReference: string }>;
}) {
  const { qrToken, paymentReference } = await params;
  return (
    <PaymentPendingPage qrToken={qrToken} paymentReference={paymentReference} />
  );
}
