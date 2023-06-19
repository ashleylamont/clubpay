import { generateAuthorizationURL } from "~/models/oidcClient";
import { createOidcSession } from "~/oidc.session.server";
import { LoaderArgs } from "@remix-run/node";

export async function loader({ request }: LoaderArgs) {
  const [url, state, nonce] = await generateAuthorizationURL();
  return await createOidcSession({
    request,
    state,
    nonce,
    immediateRedirectTo: url,
    finishRedirectTo: new URLSearchParams(request.url).get("redirectTo") ?? "/",
  });
}
