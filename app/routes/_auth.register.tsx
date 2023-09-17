import type { LoaderFunctionArgs } from "@remix-run/node";
import { commitSession, getSession } from "~/services/session.server";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Form } from "~/components/forms/form";
import { z } from "zod";
import SelectComponent from "~/components/forms/selectComponent";
import { prisma } from "~/services/db.server";

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
  const session = await getSession(request.headers.get("Cookie"));
  const userinfo = session.get("userinfo");
  if (!userinfo) {
    return redirect(session.has("user") ? "/" : "/login");
  }
  return json({ userinfo });
}

export async function action({ request }: LoaderFunctionArgs) {
  const data = await request.formData();
  const session = await getSession(request.headers.get("Cookie"));
  const providerUserId = session.get("providerUserId");
  const provider = session.get("provider");
  const userData = UserModel.parse(Object.fromEntries(data.entries()));
  const user = await prisma.user.create({
    data: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      preferredName: userData.preferredName,
      email: userData.email,
      pronouns: [userData.pronouns],
      otherPronouns: userData.otherPronouns,
      authentications: {
        create: {
          providerUserId,
          provider,
        },
      },
    },
  });
  session.set("user", user);
  session.unset("providerUserId");
  session.unset("provider");
  session.unset("userinfo");
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export default function Register() {
  const { userinfo } = useLoaderData<typeof loader>();
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
