import { checkPermission, PERMISSION } from "~/services/auth/auth.server";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  // Check if current user has permission to manage members
  // If not, redirect to home
  const hasPermission = await checkPermission(
    request,
    PERMISSION.MANAGE_MEMBERS,
  );
  if (!hasPermission) {
    return redirect("/");
  }
  return null;
}

export default function ManageMembers() {
  return <Outlet />;
}
