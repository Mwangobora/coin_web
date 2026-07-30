import { invalidQrError } from "@/lib/errors/public-error";

import { mockQrResponses } from "./charging-data";

export async function resolveMockChargingQr(qrToken: string) {
  await new Promise((resolve) => setTimeout(resolve, 350));
  const response = mockQrResponses[qrToken];
  if (!response) throw invalidQrError();
  return response;
}
