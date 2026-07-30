import axios from "axios";

export type PublicApiError = {
  message: string;
  status?: number;
  code?: string;
};

export function mapPublicApiError(error: unknown): PublicApiError {
  if (!axios.isAxiosError(error)) {
    return { message: "Something went wrong. Please try again." };
  }
  if (error.code === "ECONNABORTED") {
    return { message: "The network is slow. Please try again.", status: 408 };
  }
  const status = error.response?.status;
  if (status === 401) return { message: "This session has expired.", status };
  if (status === 404)
    return { message: "This QR code is not available.", status };
  if (status === 409) {
    return { message: "This PIN was already shown once.", status };
  }
  if (status && status >= 500) {
    return { message: "The service is unavailable right now.", status };
  }
  return { message: "We could not complete that step.", status };
}
