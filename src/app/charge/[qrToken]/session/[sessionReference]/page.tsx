import { SessionRevealPage } from "@/features/payments/components/session-reveal-page";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ qrToken: string; sessionReference: string }>;
}) {
  const { qrToken, sessionReference } = await params;
  return (
    <SessionRevealPage qrToken={qrToken} sessionReference={sessionReference} />
  );
}
