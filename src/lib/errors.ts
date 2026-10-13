import { isApiError } from "@/lib/apiClient";

// Friendly copy for the contract's error catalog (section 7) plus the proxy's
// own network codes. Raw codes are never shown to end users.
const MESSAGES: Record<string, string> = {
  INVALID_REQUEST: "That request wasn't valid. Please check your message and try again.",
  INVALID_JSON: "That request wasn't valid. Please try again.",
  UNKNOWN_PROFILE: "That demo customer doesn't exist.",
  UNAUTHENTICATED: "Your demo session has ended. Choose a customer to start again.",
  CONVERSATION_NOT_FOUND: "This conversation is no longer available.",
  PAYLOAD_TOO_LARGE: "That message is too long. Please shorten it.",
  RATE_LIMITED: "You're sending messages a little fast. Please wait a moment.",
  AI_RATE_LIMITED: "The assistant is busy right now. Try again in a minute.",
  AI_ERROR: "The assistant ran into a problem. Your message wasn't saved, so it's safe to retry.",
  AI_UNAVAILABLE: "The assistant is unavailable right now.",
  AI_TIMEOUT: "The assistant took too long to answer. Your message wasn't saved, so it's safe to retry.",
  TOO_MANY_SESSIONS: "The demo is at capacity. Please try again later.",
  INTERNAL_ERROR: "Something went wrong on our side. Your message wasn't saved, so it's safe to retry.",
  UPSTREAM_UNREACHABLE: "The demo server is waking up. This can take up to a minute.",
  UPSTREAM_TIMEOUT: "The server didn't answer in time.",
  NETWORK_ERROR: "We couldn't reach the server. Check your connection and try again.",
};

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return MESSAGES[error.code] ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

/** Errors where the server may or may not have processed the request. */
export function isUnknownOutcome(error: unknown): boolean {
  return (
    isApiError(error) &&
    (error.code === "NETWORK_ERROR" || error.code === "UPSTREAM_TIMEOUT")
  );
}
