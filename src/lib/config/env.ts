import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_USE_MOCK_API: z.boolean(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://coin-acceptor-backend.onrender.com/api/v1",
  NEXT_PUBLIC_USE_MOCK_API:
    process.env.NEXT_PUBLIC_USE_MOCK_API?.toLowerCase() === "true",
});

if (!parsed.success) {
  throw new Error("Invalid public customer web environment configuration.");
}

export const env = parsed.data;
