export const roles = ["BUYER", "SUPPLIER", "ORG_ADMIN"] as const;
export type Role = typeof roles[number];
export type Permission = "workspace:read" | "demand:manage" | "offer:manage" | "organization:manage";
const grants: Record<Role, readonly Permission[]> = {
  BUYER: ["workspace:read", "demand:manage"],
  SUPPLIER: ["workspace:read", "offer:manage"],
  ORG_ADMIN: ["workspace:read", "organization:manage"],
};
export function hasPermission(role: string, permission: Permission) {
  return Object.hasOwn(grants, role) && grants[role as Role].includes(permission);
}
export type Membership = { userId: string; organizationId: string; role: string; status: string };
export function authorizeMembership(membership: Membership | null, userId: string, organizationId: string, permission: Permission) {
  return !!membership && membership.userId === userId && membership.organizationId === organizationId && membership.status === "ACTIVE" && hasPermission(membership.role, permission);
}
