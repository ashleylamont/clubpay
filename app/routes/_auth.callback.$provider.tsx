import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import authenticationConfig from "../../authentication.config";
import { getClient, redirectUrl } from "~/services/auth/auth-config.server";
import * as UserSession from "~/services/user.session.server";
import * as AuthSession from "~/services/auth.session.server";
import { prisma } from "~/services/db.server";
import { Link } from "@remix-run/react";
import type { UserData } from "~/services/auth/auth.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const providerName = params.provider;
  if (
    !providerName ||
    !authenticationConfig.providers.some(
      (provider) => provider.name === providerName,
    )
  ) {
    return redirect("/login");
  }

  const authSession = await AuthSession.getSession(
    request.headers.get("Cookie"),
  );
  const providerClient = await getClient(providerName);
  const clientParams = providerClient.callbackParams(request.url);
  const tokenSet = await providerClient.callback(
    // providerClient.issuer.metadata.token_endpoint,
    redirectUrl(providerName),
    clientParams,
    { code_verifier: authSession.get("codeVerifier") },
  );
  authSession.unset("codeVerifier");
  const userinfo = await providerClient.userinfo(tokenSet?.access_token ?? "");
  const providerUserId = userinfo.sub;
  // Check if user has previously authenticated with this provider
  const existingUserAuthentication = await prisma.userAuthentication.findUnique(
    {
      where: {
        providerUserId_provider: {
          provider: providerName,
          providerUserId,
        },
      },
      include: {
        user: {
          include: {
            permissions: true,
          },
        },
      },
    },
  );
  if (!existingUserAuthentication) {
    // User has not previously authenticated with this provider, so we'll need to create a new user
    authSession.set("providerUserId", providerUserId);
    authSession.set("provider", providerName);
    authSession.set("userinfo", userinfo);
    return redirect("/register", {
      headers: {
        "Set-Cookie": await AuthSession.commitSession(authSession),
      },
    });
  } else {
    const userSession = await UserSession.getSession(
      request.headers.get("Cookie"),
    );
    // User has previously authenticated with this provider, so we can log them in
    const user: UserData = {
      ...existingUserAuthentication.user,
      manageClub:
        existingUserAuthentication.user.superuser ||
        (existingUserAuthentication.user.permissions?.manageClub ?? false),
      manageMemberships:
        existingUserAuthentication.user.superuser ||
        (existingUserAuthentication.user.permissions?.manageMemberships ??
          false),
      manageMembers:
        existingUserAuthentication.user.superuser ||
        (existingUserAuthentication.user.permissions?.manageMembers ?? false),
      manageEvents:
        existingUserAuthentication.user.superuser ||
        (existingUserAuthentication.user.permissions?.manageEvents ?? false),
    };
    userSession.set("user", user);
    return redirect("/", {
      headers: {
        "Set-Cookie": await UserSession.commitSession(userSession),
      },
    });
  }
}

export default function AuthCallback() {
  return (
    <div>
      You should not ever see this screen. Maybe try going{" "}
      <Link to="/">home</Link> instead?
    </div>
  );
}
