import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { validateCallbackToken } from "~/models/oidcClient";
import { getSession } from "~/oidc.session.server";
import { createUserSession } from "~/user.session.server";

export async function loader({ request }: LoaderArgs) {
  try {
    const [user, auth] = await validateCallbackToken(request);
    const session = await getSession(request);
    const redirectTo = session.get("redirectTo");
    return await createUserSession({
      request,
      userId: user.id,
      userEmail: user.email,
      userName: user.name ?? "",
      userAuthProvider: auth.provider,
      userAuthProviderId: auth.providerUserId,
      immediateRedirectTo: redirectTo ?? "/"
    });
  } catch (error) {
    console.error(error);
    return json({ error: String(error) }, { status: 500 });
  }
}
