import type { LoaderArgs, TypedResponse } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { prisma } from "~/db.server";
import { getSession, isLoggedIn, USER_EMAIL_KEY } from "~/user.session.server";
import { useLoaderData } from "@remix-run/react";
import { List, ListItem, ListItemText } from "@mui/material";

export async function loader({ request }: LoaderArgs) {
  if (!await isLoggedIn(request)) {
    throw redirect(`/doLogin?redirectTo=${encodeURIComponent(request.url)}`);
  }
  const session = await getSession(request);
  const user = await prisma.user.findUnique({
    where: {
      email: session.get(USER_EMAIL_KEY)
    },
    include: {
      memberships: {
        include: {
          membershipType: {
            include: {
              club: true
            }
          }
        }
      }
    }
  })
  return json(user);
}

type GetLoaderDataType<T  extends (...args: never[])=>Promise<TypedResponse<any>>> = T  extends (...args: never[])=>Promise<TypedResponse<infer U >> ? U: never;

export default function Memberships() {
  const data: GetLoaderDataType<typeof loader> = useLoaderData();
  return (
    <List>
      {data?.memberships?.map(membership => (
        <ListItem key={membership.id}>
          <ListItemText primary={membership.membershipType.club.name} secondary={membership.membershipType.name} />
        </ListItem>
      ))}
    </List>
  )
}
