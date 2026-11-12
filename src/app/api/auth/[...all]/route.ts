import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/server/auth";
import { getOperationalEnvironment } from "@/server/env";
import { AppError, errorResponse } from "@/server/errors";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try { return await toNextJsHandler(getAuth()).GET(request); } catch (error) { return errorResponse(error); }
}
export async function POST(request: Request) {
  try {
    const env = getOperationalEnvironment();
    if (request.headers.get("origin") !== new URL(env.APP_BASE_URL).origin) throw new AppError("INVALID_ORIGIN", 403, "Untrusted request origin.");
    return await toNextJsHandler(getAuth()).POST(request);
  } catch (error) { return errorResponse(error); }
}
