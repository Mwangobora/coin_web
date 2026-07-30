import { LoadingState } from "@/components/feedback/loading-state";
import { CustomerHeader } from "@/components/layout/customer-header";
import { PageContainer } from "@/components/layout/page-container";

export default function ChargeLoading() {
  return (
    <PageContainer>
      <CustomerHeader />
      <LoadingState title="Loading charger availability" />
    </PageContainer>
  );
}
