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
      <div className="flex flex-row w-full items-center justify-end pb-4">
        {rootData?.user?.manageMembers && (
          <SubMenuLink to="/manage/members" label="Members" />
        )}
        {rootData?.user?.manageEvents && (
          <SubMenuLink to="/manage/events" label="Events" />
        )}
        {rootData?.user?.manageMemberships && (
          <SubMenuLink to="/manage/memberships" label="Memberships" />
        )}
        {rootData?.user?.manageClub && (
          <SubMenuLink to="/manage/club" label="Club" />
        )}
      </div>
      <div className="flex flex-col items-center justify-center flex-auto h-full py-2">
        <main className="flex flex-col items-center justify-center flex-1 px-20 text-center max-w-3xl">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
