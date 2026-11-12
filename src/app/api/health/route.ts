import { getEnvironment } from "@/server/env";
import { errorResponse } from "@/server/errors";
export async function GET() {
  try { const env = getEnvironment(); return Response.json({ status: "ok", scope: "application-liveness", mode: env.APP_MODE, payments: "disabled", ai: "disabled" }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return errorResponse(error); }
}
