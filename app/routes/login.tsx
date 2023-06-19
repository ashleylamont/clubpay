import type { ActionArgs } from "@remix-run/node";
import { generateAuthorizationURL } from "~/models/oidcClient";
import { Form } from "@remix-run/react";
import { createOidcSession } from "~/oidc.session.server";

export async function action({request}: ActionArgs) {
  const [url, state, nonce] = await generateAuthorizationURL();
  return await createOidcSession({request, state, nonce, immediateRedirectTo: url, finishRedirectTo: '/'});
}

export default function OidcLoginRoute() {
  return (
    <Form method="post" action="/login">
      <button className="rounded p-2 bg-blue-500" type="submit">Login</button>
    </Form>
  )
}
