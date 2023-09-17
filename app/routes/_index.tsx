import type { MetaFunction } from "@remix-run/node";
import { Link, useRouteLoaderData } from "@remix-run/react";
import type { loader as rootLoader } from "../root";
import ButtonComponent from "~/components/forms/buttonComponent";

export const meta: MetaFunction = () => [{ title: "ClubPay" }];

export default function Index() {
  const data = useRouteLoaderData<typeof rootLoader>("root");
  return (
    <div className="flex flex-col justify-center items-center gap-2 min-h-screen">
      {data?.user ? (
        <>
          <h1 className="text-2xl font-bold">
            Welcome, {data.user.preferredName || data.user.firstName}
          </h1>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold">Welcome to ClubPay</h1>
          <Link to="/login">
            <ButtonComponent>Login</ButtonComponent>
          </Link>
        </>
      )}
    </div>
  );
}
