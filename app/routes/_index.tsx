import type { V2_MetaFunction } from "@remix-run/node";
import OidcLoginRoute from "~/routes/login";
import appConfig from "../../app.config";

export const meta: V2_MetaFunction = () => [{ title: appConfig.appName }];

export default function Index() {
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <div>
        <h1>{appConfig.appName}</h1>
        <OidcLoginRoute/>
      </div>
    </main>
  );
}
