import "server-only";
import { log } from "./logger";
export class AppError extends Error {
  constructor(public code: string, public status: number, message: string) { super(message); }
}
export function errorResponse(error: unknown, requestId = crypto.randomUUID()) {
  const known = error instanceof AppError;
  log(known && error.status < 500 ? "warn" : "error", "request_failed", { requestId, code: known ? error.code : "SERVICE_UNAVAILABLE" });
  return Response.json({ error: { code: known ? error.code : "SERVICE_UNAVAILABLE", message: known ? error.message : "Service unavailable. Check server configuration and database connectivity.", retryable: !known || error.status >= 500 }, requestId },
    { status: known ? error.status : 503, headers: { "Cache-Control": "no-store", "X-Request-Id": requestId } });
}
