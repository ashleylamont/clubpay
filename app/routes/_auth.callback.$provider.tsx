import type { LoaderFunctionArgs } from "@remix-run/node";
import authenticationConfig from "../../authentication.config";
import { redirect } from "@remix-run/node";
import { getClient, redirectUrl } from "~/services/auth/auth-config.server";
import { commitSession, getSession } from "~/services/session.server";
import { prisma } from "~/services/db.server";
import { Link } from "@remix-run/react";

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

  const session = await getSession(request.headers.get("Cookie"));
  const providerClient = await getClient(providerName);
  const clientParams = providerClient.callbackParams(request.url);
  const tokenSet = await providerClient.callback(
    // providerClient.issuer.metadata.token_endpoint,
    redirectUrl(providerName),
    clientParams,
    { code_verifier: session.get("codeVerifier") },
  );
  session.unset("codeVerifier");
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
        user: true,
      },
    },
  );
  if (!existingUserAuthentication) {
    // User has not previously authenticated with this provider, so we'll need to create a new user
    session.set("providerUserId", providerUserId);
    session.set("provider", providerName);
    session.set("userinfo", userinfo);
    return redirect("/register", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    // User has previously authenticated with this provider, so we can log them in
    session.set("user", existingUserAuthentication.user);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
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
