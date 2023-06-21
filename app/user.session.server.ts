import type {
  TypedResponse
} from "@remix-run/node";
import {
  createCookieSessionStorage,
  json,
  redirect
} from "@remix-run/node";
import invariant from "tiny-invariant";
import { getUserById } from "~/models/user.server";
import type { User } from "@prisma/client";
import * as jdenticon from "jdenticon";
import md5 from "md5";

invariant(process.env.SESSION_SECRET, "SESSION_SECRET must be set");

export const USER_ID_KEY = "userId";
export const USER_EMAIL_KEY = "userEmail";
export const USER_NAME_KEY = "userName";
export const USER_AUTH_PROVIDER_KEY = "userAuthProvider";
export const USER_AUTH_PROVIDER_ID_KEY = "userAuthProviderId";

export const sessionStorage = createCookieSessionStorage<{
  [USER_ID_KEY]?: number;
  [USER_EMAIL_KEY]?: string;
  [USER_NAME_KEY]?: string;
  [USER_AUTH_PROVIDER_KEY]?: string;
  [USER_AUTH_PROVIDER_ID_KEY]?: string;
}>({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production"
  }
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function isLoggedIn(request: Request): Promise<boolean> {
  const session = await getSession(request);
  const userId = session.get(USER_ID_KEY);
  if (!userId) return false;
  const user = await getUserById(userId);
  return !!user;
}

export async function requireLoggedInDirect(
  request: Request
): Promise<User & {fallbackProfile: string}> {
  const loggedIn = await isLoggedIn(request);
  if (!loggedIn) {
    throw redirect(`/doLogin?redirectTo=${encodeURIComponent(request.url)}`);
  }
  const session = await getSession(request);
  const userId = session.get(USER_ID_KEY);
  invariant(userId, "User ID must be set");
  const user = await getUserById(userId);
  invariant(user, "User must exist");
  const fallbackProfile = jdenticon.toPng(md5(user.email), 200, {
    lightness: {
      color: [0.47, 0.77],
      grayscale: [0.55, 1.00]
    },
    saturation: {
      color: 0.94,
      grayscale: 0.24
    },
    backColor: "#00000000"
  }).toString("base64");
  return {...user, fallbackProfile};
}

export async function requireLoggedIn(
  request: Request
): Promise<TypedResponse<User & {fallbackProfile: string}>> {
  return json(await requireLoggedInDirect(request));
}

export async function createUserSession(
  {
    request,
    userId,
    userEmail,
    userName,
    userAuthProvider,
    userAuthProviderId,
    immediateRedirectTo
  }: {
    request: Request;
    userId: number;
    userEmail: string;
    userName: string;
    userAuthProvider: string;
    userAuthProviderId: string;
    immediateRedirectTo: string;
  }) {
  const session = await getSession(request);

  // Verify that the user exists
  const user = await getUserById(userId);
  invariant(user, "User must exist");
  // Verify that the user's email matches the email from the auth provider
  invariant(user.email === userEmail, "User email must match auth provider email");

  // Set the session values
  session.set(USER_ID_KEY, userId);
  session.set(USER_EMAIL_KEY, userEmail);
  session.set(USER_NAME_KEY, userName);
  session.set(USER_AUTH_PROVIDER_KEY, userAuthProvider);
  session.set(USER_AUTH_PROVIDER_ID_KEY, userAuthProviderId);

  // Commit the session
  return redirect(immediateRedirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session)
    }
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}
