import { requireMembership } from "@/server/authorization";
import { errorResponse } from "@/server/errors";
export async function GET(_request: Request, context: { params: Promise<{ organizationId: string }> }) {
  try {
    const { organizationId } = await context.params;
    const { membership } = await requireMembership(organizationId, "workspace:read");
    return Response.json({ organization: { id: membership.organization.id, name: membership.organization.name, isDemo: membership.organization.isDemo }, role: membership.role }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return errorResponse(error); }
}
