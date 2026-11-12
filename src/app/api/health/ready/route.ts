import { getDb } from "@/server/db";
import { errorResponse } from "@/server/errors";
export async function GET() {
  try { await getDb().$queryRaw`SELECT 1`; return Response.json({ status: "ready", database: "reachable", scope: "connectivity-only" }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return errorResponse(error); }
}
