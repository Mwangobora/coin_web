import axios from "axios";

import { env } from "@/lib/env";

import { mapPublicApiError } from "./api-error";

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15_000,
  headers: { Accept: "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(mapPublicApiError(error)),
);
