import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node";
import OidcLoginRoute from "~/routes/login";
import appConfig from "../../app.config";
import { Link, Typography } from "@mui/material";
import { isLoggedIn } from "~/user.session.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import React from "react";

export const meta: V2_MetaFunction = () => [{ title: appConfig.appName }];

export async function loader({request}: LoaderArgs) {
  const loggedIn = await isLoggedIn(request);
  return json(loggedIn);
}

export default function Index() {
  const loggedIn = useLoaderData();
  return (
    <main>
      <Typography variant="h1">Welcome to {appConfig.appName}</Typography>
      {loggedIn ? <>
        <Typography variant="h2">You are logged in</Typography>
        <Link href="/app">Go to app</Link>
      </> : <>
        <Typography variant="h2">You are not logged in</Typography>
        <OidcLoginRoute />
      </>}
    </main>
  );
}
