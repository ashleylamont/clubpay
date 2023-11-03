import { createCookieSessionStorage } from "@remix-run/node";
import { config } from "dotenv";
import { assertExists } from "~/utils";
import type { UserData } from "~/services/auth/auth.server";

config();

export interface UserSessionData {
  user: UserData;
}

export let sessionStorage = createCookieSessionStorage<UserSessionData>({
  cookie: {
    name: "_userSession", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [assertExists(process.env.SESSION_SECRET)], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

export let { getSession, commitSession, destroySession } = sessionStorage;
