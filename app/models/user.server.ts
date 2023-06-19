import type { Authentication, User } from "@prisma/client";

import { prisma } from "~/db.server";
import type { UserinfoResponse } from "openid-client";
import { redirect } from "@remix-run/node";
import { getSession, sessionStorage } from "~/oidc.session.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}


export async function createOidcUser(userInfo: UserinfoResponse, provider: string): Promise<[User, Authentication]> {
  const {
    sub,
    name,
    email,
    picture
  } = userInfo;

  if (!email) {
    throw new Error("No email address provided");
  }

  // Create the User record first
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name,
      avatarUrl: picture,
    },
    update: {
      name,
      avatarUrl: picture,
    }
  });

  // Then create the OIDC record
  const auth = await prisma.authentication.upsert({
    where: { provider_providerUserId: { provider, providerUserId: sub } },
    create: {
      provider,
      providerUserId: sub,
      providerData: JSON.stringify(userInfo),
      user: {
        connect: { id: user.id }
      }
    },
    update: {
      providerData: JSON.stringify(userInfo),
      user: {
        connect: { id: user.id }
      }
    }
  });

  return [user, auth];
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}
