import { Link } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/services/user.session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  session.unset("user");
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Logout() {
  return (
    <div>
      You should not see this screen. <Link to="/">Go home?</Link>
    </div>
  );
}
