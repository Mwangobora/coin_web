import { CheckoutPage } from "@/features/public-charging/components/checkout-page";
import { CustomerShell } from "@/features/public-charging/components/customer-shell";

export default function CheckoutRoute() {
  return (
    <CustomerShell>
      <CheckoutPage />
    </CustomerShell>
  );
}
