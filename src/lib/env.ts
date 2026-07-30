import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL:
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1",
});

if (!parsed.success) {
  throw new Error("Invalid public customer web environment configuration.");
}

export const env = parsed.data;
