import "server-only";
import { headers } from "next/headers";
import { getAuth } from "./auth";
import { getDb } from "./db";
import { AppError } from "./errors";
import { authorizeMembership, type Permission } from "./permissions";
export async function requireSession() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) throw new AppError("UNAUTHENTICATED", 401, "Sign in to continue.");
  return session;
}
export async function requireMembership(organizationId: string, permission: Permission) {
  const session = await requireSession();
  // Neither role headers nor client session data are used to grant access.
  const membership = await getDb().organizationMembership.findUnique({ where: { organizationId_userId: { organizationId, userId: session.user.id } }, include: { organization: true } });
  if (!authorizeMembership(membership, session.user.id, organizationId, permission)) throw new AppError("FORBIDDEN", 403, "You do not have access to this organization or operation.");
  return { session, membership: membership! };
}
