import axios from "axios";

export type PublicErrorKind =
  "invalid-qr" | "network" | "unavailable" | "unknown";

export type PublicCustomerError = {
  kind: PublicErrorKind;
  title: string;
  message: string;
};

export function mapPublicError(error: unknown): PublicCustomerError {
  if (isPublicError(error)) return error;
  if (!axios.isAxiosError(error)) return fallbackError();
  if (error.code === "ECONNABORTED" || error.code === "ERR_NETWORK") {
    return {
      kind: "network",
      title: "Network problem",
      message: "Check your connection and try again.",
    };
  }
  if (error.response?.status === 404) return invalidQrError();
  if (error.response && error.response.status >= 500) {
    return {
      kind: "unavailable",
      title: "Service unavailable",
      message: "The charging service is unavailable right now.",
    };
  }
  return fallbackError();
}

export function invalidQrError(): PublicCustomerError {
  return {
    kind: "invalid-qr",
    title: "QR code not recognized",
    message: "Scan the machine QR code again or ask station support.",
  };
}

function fallbackError(): PublicCustomerError {
  return {
    kind: "unknown",
    title: "Something went wrong",
    message: "We could not load this charging machine.",
  };
}

function isPublicError(error: unknown): error is PublicCustomerError {
  return (
    !!error &&
    typeof error === "object" &&
    "kind" in error &&
    "title" in error &&
    "message" in error
  );
}
