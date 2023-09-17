import authenticationConfig from "../../authentication.config";
import {
  Form,
  Link,
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
} from "@remix-run/react";
import type { loader as rootLoader } from "../root";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { commitSession, getSession } from "~/services/session.server";
import { getAuthorisationUrl } from "~/services/auth/auth.server";

export async function loader({}: LoaderFunctionArgs) {
  const providers = authenticationConfig.providers.map(
    (provider) => provider.name,
  );
  return json({ providers });
}

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();
  const providerName = data.get("provider");
  if (
    !providerName ||
    typeof providerName !== "string" ||
    !authenticationConfig.providers.some(
      (provider) => provider.name === providerName,
    )
  ) {
    return redirect("/login");
  }
  const session = await getSession(request.headers.get("Cookie"));
  const authorisationUrl = await getAuthorisationUrl(providerName, session);
  return redirect(authorisationUrl, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Triage() {
  const { providers } = useLoaderData<typeof loader>();
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const navigate = useNavigate();

  if (rootData?.user) {
    navigate("/", { replace: true });
    return (
      <div>
        You are already logged in as {rootData.user.firstName}.<br />
        <Link to="/">Go to home</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">ClubPay Log in</h1>
      <Form method="post">
        {providers.map((provider) => (
          <button
            key={provider}
            type="submit"
            name="provider"
            value={provider}
            className="btn btn-primary"
          >
            Log in with {provider}
          </button>
        ))}
      </Form>
    </div>
  );
}
