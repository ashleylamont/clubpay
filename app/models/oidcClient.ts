import type { CallbackParamsType, Client } from "openid-client";
import { generators, Issuer } from "openid-client";
import dotenv from "dotenv";
import { getSession, OIDC_NONCE_KEY, OIDC_STATE_KEY } from "~/oidc.session.server";
import { createOidcUser } from "~/models/user.server";
import { Authentication, User } from "@prisma/client";

dotenv.config();

const clientId = process.env.OIDC_CLIENT_ID;
const clientSecret = process.env.OIDC_SECRET;
const metadataUrl = `https://login.microsoftonline.com/${process.env.OIDC_TENANT_ID}/v2.0/.well-known/openid-configuration`;
const localServerPort = 3000;

if (!clientId || !clientSecret || !metadataUrl) {
  throw new Error("Missing OIDC configuration");
}

let client: Client;

const initialisation = (async () => {
  // Discover the OIDC provider
  const provider = await Issuer.discover(metadataUrl);

  // Create a new OIDC client using the discovered provider
  client = new provider.Client({
    client_id: clientId,
    client_secret: clientSecret
  });
})();

export async function generateAuthorizationURL(): Promise<[string, string, string]> {
  await initialisation;

  // Generate a random state and nonce
  const state = generators.state();
  const nonce = generators.nonce();

  // Generate the authorization URL
  return [client.authorizationUrl({
    scope: "openid profile email",
    redirect_uri: `http://localhost:${localServerPort}/callback`,
    response_type: "code",
    state,
    nonce
  }), state, nonce];
}

export async function validateCallbackToken(request: Request): Promise<[User, Authentication]> {
  await initialisation;

  const query = new URL(request.url).searchParams;
  const params: CallbackParamsType = Object.fromEntries(query.entries());

  // Retrieve the state and nonce from the session
  const session = await getSession(request);
  const state = session.get(OIDC_STATE_KEY);
  const nonce = session.get(OIDC_NONCE_KEY);

  // Validate the state
  if (params.state !== state) {
    console.log(`Expected state: ${state}`);
    console.log(`Actual state: ${params.state}`);
    throw new Error("State mismatch");
  }

  // Exchange the authorization code for tokens
  const tokenSet = await client.callback(`http://localhost:${localServerPort}/callback`, params, {
    state,
    nonce
  });
  if (!tokenSet) {
    throw new Error("Token set is empty");
  }

  // Fetch the user's information
  const userInfo = await client.userinfo(tokenSet);

  // Create the user record
  const [user, auth] = await createOidcUser(userInfo, "azure");

  return [user, auth];
}
