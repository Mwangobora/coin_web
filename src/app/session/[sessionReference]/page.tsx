import { CustomerShell } from "@/features/public-charging/components/customer-shell";
import { SessionPage } from "@/features/public-charging/components/session-page";

export default async function SessionRoute({
  params,
}: {
  params: Promise<{ sessionReference: string }>;
}) {
  const { sessionReference } = await params;
  return (
    <CustomerShell>
      <SessionPage sessionReference={sessionReference} />
    </CustomerShell>
  );
}
