import { createCookieSessionStorage, redirect, Session } from "@remix-run/node";
import invariant from "tiny-invariant";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const OIDC_STATE_KEY = "state";
export const OIDC_NONCE_KEY = "nonce";
export const REDIRECT_TO_KEY = "redirectTo";

export const sessionStorage = createCookieSessionStorage<{
  [OIDC_STATE_KEY]?: string;
  [OIDC_NONCE_KEY]?: string;
  [REDIRECT_TO_KEY]?: string;
}>({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getOidcParameters(
  request: Request
): Promise<[string, string] | undefined> {
  const session = await getSession(request);
  const state = session.get(OIDC_STATE_KEY);
  const nonce = session.get(OIDC_NONCE_KEY);
  if (state && nonce) return [state, nonce];
}

export async function requireOidcParameters(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const parameters = await getOidcParameters(request);
  if (!parameters) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return parameters;
}

export async function createOidcSession({
  request,
  state,
  nonce,
  immediateRedirectTo,
  finishRedirectTo,
}: {
  request: Request;
  state: string;
  nonce: string;
  immediateRedirectTo: string;
  finishRedirectTo: string;
}) {
  const session = await getSession(request);
  session.set(OIDC_STATE_KEY, state);
  session.set(OIDC_NONCE_KEY, nonce);
  session.set(REDIRECT_TO_KEY, finishRedirectTo);

  return redirect(immediateRedirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}
