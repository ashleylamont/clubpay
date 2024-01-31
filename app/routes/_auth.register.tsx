import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import * as UserSession from "~/services/user.session.server";
import * as AuthSession from "~/services/auth.session.server";
import { useLoaderData } from "@remix-run/react";
import { Form } from "~/components/forms/form";
import { z } from "zod";
import SelectComponent from "~/components/forms/selectComponent";
import { prisma } from "~/services/db.server";
import type { UserData } from "~/services/auth/auth.server";
import { RiAlertLine } from "@remixicon/react";

const UserModel = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  preferredName: z.string().nullable(),
  email: z.string().email(),
  pronouns: z.union([
    z.literal("HE_HIM"),
    z.literal("SHE_HER"),
    z.literal("THEY_THEM"),
    z.literal("OTHER"),
  ]),
  otherPronouns: z.string().nullable(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  const authSession = await AuthSession.getSession(
    request.headers.get("Cookie"),
  );
  const userinfo = authSession.get("userinfo");
  if (!userinfo) {
    const userSession = await UserSession.getSession(
      request.headers.get("Cookie"),
    );
    return redirect(userSession.has("user") ? "/" : "/login");
  }
  const willBeSuperuser = (await prisma.user.count()) === 0;
  return json({ userinfo, willBeSuperuser });
}

export async function action({ request }: LoaderFunctionArgs) {
  const data = await request.formData();
  const authSession = await AuthSession.getSession(
    request.headers.get("Cookie"),
  );
  const providerUserId = authSession.get("providerUserId");
  const provider = authSession.get("provider");
  if (!providerUserId || !provider) {
    return redirect("/login");
  }
  const oauthUserData = UserModel.parse(Object.fromEntries(data.entries()));
  const willBeSuperuser = (await prisma.user.count()) === 0;
  const user = await prisma.user.create({
    data: {
      firstName: oauthUserData.firstName,
      lastName: oauthUserData.lastName,
      preferredName: oauthUserData.preferredName,
      email: oauthUserData.email,
      pronouns: oauthUserData.pronouns,
      otherPronouns: oauthUserData.otherPronouns,
      superuser: willBeSuperuser,
      authentications: {
        create: {
          providerUserId,
          provider,
        },
      },
    },
  });
  const userSession = await UserSession.getSession(
    request.headers.get("Cookie"),
  );
  const userData: UserData = {
    ...user,
    manageClub: willBeSuperuser,
    manageMemberships: willBeSuperuser,
    manageMembers: willBeSuperuser,
    manageEvents: willBeSuperuser,
  };
  userSession.set("user", userData);
  authSession.unset("providerUserId");
  authSession.unset("provider");
  authSession.unset("userinfo");
  const headers = new Headers();
  headers.append("Set-Cookie", await UserSession.commitSession(userSession));
  headers.append("Set-Cookie", await AuthSession.commitSession(authSession));
  return redirect("/", {
    headers,
  });
}

export default function Register() {
  const { userinfo, willBeSuperuser } = useLoaderData<typeof loader>();
  const PrefilledUserModel = UserModel.extend({
    firstName: UserModel.shape.firstName
      .nullable()
      .default(userinfo?.given_name ?? ""),
    lastName: UserModel.shape.lastName
      .nullable()
      .default(userinfo?.family_name ?? ""),
    email: UserModel.shape.email.nullable().default(userinfo?.email ?? ""),
  });

  return (
    <Form schema={PrefilledUserModel}>
      {({ Field, Errors, Button, register }) => (
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Register New User</h1>
          {willBeSuperuser && (
            <div className="alert alert-warning">
              <RiAlertLine size={24} />
              You are the first user to register.
              <br />
              You will be a superuser.
            </div>
          )}
          <div className="flex flex-row gap-2">
            <Field name="firstName" label="First Name" />
            <Field name="lastName" label="Last Name" />
          </div>
          <Field name="preferredName" label="Preferred Name" />
          <Field name="email" label="Email" />
          <Field name="pronouns" label="Pronouns">
            {({ Label, Errors }) => (
              <>
                <Label />
                <SelectComponent {...register("pronouns")}>
                  <option value="HE_HIM">He/Him</option>
                  <option value="SHE_HER">She/Her</option>
                  <option value="THEY_THEM">They/Them</option>
                  <option value="OTHER">Other</option>
                </SelectComponent>
              </>
            )}
          </Field>
          <Field name="otherPronouns" label="Other Pronouns" />
          <Errors />
          <Button>Register</Button>
        </div>
      )}
    </Form>
  );
}
