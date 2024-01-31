import { prisma } from "~/services/db.server";
import { Link, useLoaderData } from "@remix-run/react";
import { displayPronouns } from "~/utils";
import type { UserPermissions } from ".prisma/client";

const permissionsInt = (userPermissions: UserPermissions | null) => {
  let result = 0;
  result += userPermissions?.manageClub ? 1 : 0;
  result += userPermissions?.manageMembers ? 4 : 0;
  result += userPermissions?.manageMemberships ? 8 : 0;
  result += userPermissions?.manageEvents ? 2 : 0;
  return result;
};

export async function loader() {
  const users = prisma.user
    .findMany({
      include: {
        permissions: true,
      },
    })
    .then((users) =>
      users.sort((a, b) => {
        if (permissionsInt(a.permissions) > permissionsInt(b.permissions))
          return -1;
        if (permissionsInt(a.permissions) < permissionsInt(b.permissions))
          return 1;
        return a.id.localeCompare(b.id);
      }),
    );
  return { users: await users };
}

export default function ManageMembersIndex() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <div className="bg-neutral shadow-lg p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Members</h2>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Email</th>
            <th>Pronouns</th>
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          {loaderData.users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link to={`/manage/members/${user.id}`}>
                  <button className="btn btn-small btn-ghost">Edit</button>
                </Link>
              </td>
              <td>
                {user.firstName} {user.lastName}{" "}
                {user.preferredName && `(${user.preferredName})`}
              </td>
              <td>{user.email}</td>
              <td>{displayPronouns(user)}</td>
              <td className="flex flex-row flex-wrap gap-1 justify-center">
                {user.superuser && (
                  <div className="tooltip" data-tip="Superuser">
                    <i className="ri-shield-fill"></i>
                  </div>
                )}
                {((user.permissions?.manageMembers || user.superuser) ??
                  user.superuser) && (
                  <div className="tooltip" data-tip="Can Manage Members">
                    <i className="ri-user-fill"></i>
                  </div>
                )}
                {((user.permissions?.manageEvents || user.superuser) ??
                  user.superuser) && (
                  <div className="tooltip" data-tip="Can Manage Events">
                    <i className="ri-calendar-2-fill"></i>
                  </div>
                )}
                {((user.permissions?.manageMemberships || user.superuser) ??
                  user.superuser) && (
                  <div className="tooltip" data-tip="Can Manage Memberships">
                    <i className="ri-coin-fill"></i>
                  </div>
                )}
                {((user.permissions?.manageClub || user.superuser) ??
                  user.superuser) && (
                  <div className="tooltip" data-tip="Can Manage Club">
                    <i className="ri-building-2-fill"></i>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
