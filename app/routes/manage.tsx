import { Link, Outlet, useMatches, useRouteLoaderData } from "@remix-run/react";
import type { loader as rootLoader } from "~/root";

export default function ManageLayout() {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const routeMatches = useMatches();
  if (!rootData?.hasManagePermissions) {
    return <div>You do not have permission to access this page.</div>;
  }
  const SubMenuLink = ({ to, label }: { to: string; label: string }) => (
    <Link to={to}>
      <button
        className={`btn ${
          routeMatches[2]?.pathname.startsWith(to)
            ? "btn-secondary"
            : "btn-ghost"
        }`}
      >
        {label}
      </button>
    </Link>
  );
  return (
    <div className="flex flex-col items-center flex-auto">
      <div className="flex flex-row w-full items-center justify-end pb-4 pr-4 gap-2">
        {(rootData?.user?.manageMembers || rootData?.user?.superuser) && (
          <SubMenuLink to="/manage/members" label="Members" />
        )}
        {(rootData?.user?.manageEvents || rootData?.user?.superuser) && (
          <SubMenuLink to="/manage/events" label="Events" />
        )}
        {(rootData?.user?.manageMemberships || rootData?.user?.superuser) && (
          <SubMenuLink to="/manage/memberships" label="Memberships" />
        )}
        {(rootData?.user?.manageClub || rootData?.user?.superuser) && (
          <SubMenuLink to="/manage/club" label="Club" />
        )}
      </div>
      <div
        className="flex flex-col items-center justify-center flex-auto h-full py-2"
        style={{ minWidth: "24rem" }}
      >
        <main className="flex flex-col items-center justify-center flex-1 text-center max-w-7xl w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
