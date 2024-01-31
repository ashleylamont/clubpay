import type { User, UserPermissions } from ".prisma/client";
import { getSession } from "~/services/user.session.server";
import { getClient, redirectUrl } from "~/services/auth/auth-config.server";
import { generators } from "openid-client";
import type { Session } from "@remix-run/node";
import { prisma } from "../db.server";

export interface UserData
  extends Omit<User, "permissions" | "createdAt" | "updatedAt">,
    Omit<UserPermissions, "userId" | "createdAt" | "updatedAt"> {}

export async function getCurrentUser(
  request: Request,
): Promise<null | UserData> {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session) return null;
  const sessionUser = session.get("user");
  if (!sessionUser) return null;
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    include: { permissions: true },
  });
  if (!user) return null;
  return {
    ...user,
    manageMemberships: user.permissions?.manageMemberships ?? false,
    manageClub: user.permissions?.manageClub ?? false,
    manageEvents: user.permissions?.manageEvents ?? false,
    manageMembers: user.permissions?.manageMembers ?? false,
  };
}

export const PERMISSION = {
  MANAGE_MEMBERSHIPS: "manageMemberships",
  MANAGE_CLUB: "manageClub",
  MANAGE_EVENTS: "manageEvents",
  MANAGE_MEMBERS: "manageMembers",
} as const;
export type PERMISSION = (typeof PERMISSION)[keyof typeof PERMISSION];

export async function checkPermission(
  request: Request,
  permission: PERMISSION,
) {
  const user = await getCurrentUser(request);
  if (!user) return false;
  return user[permission] || user.superuser;
}

export async function getAuthorisationUrl(
  providerName: string,
  session: Session,
) {
  const providerClient = await getClient(providerName);
  const codeVerifier = generators.codeVerifier();
  session.set("codeVerifier", codeVerifier);
  return providerClient.authorizationUrl({
    scope: "openid profile email",
    code_challenge: generators.codeChallenge(codeVerifier),
    code_challenge_method: "S256",
    redirect_uri: redirectUrl(providerName),
  });
}
