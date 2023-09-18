import { cssBundleHref } from "@remix-run/css-bundle";
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css";
import { currentUser } from "~/services/auth/auth.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await currentUser(request);
  return json({ user });
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <title>ClubPay</title>
      </head>
      <body className="h-full">
        <nav className="flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold">
            <Link to="/">ClubPay</Link>
          </h1>
          <div className="flex flex-row items-center gap-2">
            <Link to="/">
              <button className="btn btn-ghost">Home</button>
            </Link>
            {user ? (
              <Link to="/logout">
                <button className="btn btn-ghost">Log out</button>
              </Link>
            ) : (
              <Link to="/login">
                <button className="btn btn-primary">Log in</button>
              </Link>
            )}
          </div>
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
