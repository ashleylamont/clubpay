import type { LoaderArgs } from "@remix-run/node";
import { requireLoggedIn } from "~/user.session.server";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderArgs) {
  return requireLoggedIn(request);
}


export default function App_index(): JSX.Element {
  useLoaderData();
  return <>
    App.
  </>
}
