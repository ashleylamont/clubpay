import type { User, UserPermissions } from ".prisma/client";
import { getSession } from "~/services/user.session.server";
import { getClient, redirectUrl } from "~/services/auth/auth-config.server";
import { generators } from "openid-client";
import type { Session } from "@remix-run/node";

export interface UserData
  extends Omit<User, "permissions" | "createdAt" | "updatedAt">,
    Omit<UserPermissions, "userId" | "createdAt" | "updatedAt"> {}

export async function currentUser(request: Request): Promise<null | UserData> {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session) {
    return null;
  }
  return session.get("user") ?? null;
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
