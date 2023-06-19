import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Wix+Madefor+Display:wght@400;700&display=swap"
    }
  ];
};

// export async function loader({ request }: LoaderArgs) {
//   return json({
//     user: await getUser(request),
//   });
// }

export default function App() {
  return (
    <html lang="en" className="h-full">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body className="h-full">
    <noscript>
      <div className="w-full bg-amber-400 text-black">
        <style>
          {`
          #noscript-notice:checked ~ * {
            display: none;
            }`}
        </style>
        <input id="noscript-notice" type="checkbox" className="hidden" />
        <label htmlFor="noscript-notice" className="flex justify-center items-center">
          You appear to have JavaScript disabled. Fair enough honestly.<br />
          Most of this site should still work, but some things might be a bit wonky.<br />
          If you want to see the cool stuff, please enable JavaScript, don't worry, we don't do
          anything too crazy with it, mostly just link prefetching and some menu
          dropdowns.<br /><br />
          Anyways, if you really don't want to enable JavaScript, click this to hide this message.
        </label>
      </div>
    </noscript>
    <Outlet />
    <ScrollRestoration />
    <Scripts />
    <LiveReload />
    </body>
    </html>
  );
}
