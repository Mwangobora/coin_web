import type {
  AccessCodeClaim,
  PaymentInitiation,
} from "@/features/payments/types/payment.types";

type FlowRecord = {
  customerFlowToken: string;
  initiation: PaymentInitiation;
};

const FLOW_PREFIX = "checkout:flow:";
const ACCESS_CODE_PREFIX = "checkout:access-code:";
const SESSION_FLOW_PREFIX = "checkout:session-flow:";

export function saveCheckoutFlow(initiation: PaymentInitiation) {
  writeJson(`${FLOW_PREFIX}${initiation.paymentReference}`, {
    customerFlowToken: initiation.customerFlowToken,
    initiation,
  } satisfies FlowRecord);
}

export function readCheckoutFlow(paymentReference: string): FlowRecord | null {
  return readJson<FlowRecord>(`${FLOW_PREFIX}${paymentReference}`);
}

export function saveSessionFlowToken(
  sessionReference: string,
  customerFlowToken: string,
) {
  writeJson(`${SESSION_FLOW_PREFIX}${sessionReference}`, customerFlowToken);
}

export function readSessionFlowToken(sessionReference: string): string | null {
  return readJson<string>(`${SESSION_FLOW_PREFIX}${sessionReference}`);
}

export function saveAccessCodeClaim(claim: AccessCodeClaim) {
  writeJson(`${ACCESS_CODE_PREFIX}${claim.sessionReference}`, claim);
}

export function readAccessCodeClaim(
  sessionReference: string,
): AccessCodeClaim | null {
  return readJson<AccessCodeClaim>(`${ACCESS_CODE_PREFIX}${sessionReference}`);
}

// useSyncExternalStore requires getSnapshot() to return a referentially
// stable value when nothing changed, but sessionStorage + JSON.parse hands
// back a new object every call. Cache parsed values per key so repeated
// reads are stable, and only reparse after a write actually changes them.
const cache = new Map<string, unknown>();

/** Test-only: clears the in-memory read cache alongside sessionStorage.clear(). */
export function resetCheckoutStorageCache() {
  cache.clear();
}

function writeJson(key: string, value: unknown) {
  cache.set(key, value);
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode, quota); the flow still
    // works, it just loses resilience across a refresh.
  }
}

function readJson<T>(key: string): T | null {
  if (cache.has(key)) return cache.get(key) as T | null;
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    const value = raw ? (JSON.parse(raw) as T) : null;
    cache.set(key, value);
    return value;
  } catch {
    return null;
  }
}
