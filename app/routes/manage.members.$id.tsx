import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/services/db.server";
import { useLoaderData, useRouteLoaderData } from "@remix-run/react";
import SelectComponent from "~/components/forms/selectComponent";
import { Form } from "~/components/forms/form";
import { z } from "zod";
import type { loader as rootLoader } from "../root";

export async function loader({ params }: LoaderFunctionArgs) {
  const user = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
    include: {
      permissions: true,
    },
  });
  return json({ user });
}

export default function ManageMember() {
  const loaderData = useLoaderData<typeof loader>();
  const targetUser = loaderData?.user;
  const rootData = useRouteLoaderData<typeof rootLoader>("root");

  if (!targetUser) {
    return <div>User not found</div>;
  }

  let UserModel = z.object({
    firstName: z.string().min(1).default(targetUser.firstName),
    lastName: z.string().min(1).default(targetUser.lastName),
    preferredName: z.string().nullable().default(targetUser.preferredName),
    email: z.string().email().default(targetUser.email),
    pronouns: z
      .union([
        z.literal("HE_HIM"),
        z.literal("SHE_HER"),
        z.literal("THEY_THEM"),
        z.literal("OTHER"),
      ])
      .nullable()
      .default(targetUser.pronouns),
    otherPronouns: z.string().nullable().default(targetUser.otherPronouns),
    manageMembers: z
      .boolean()
      .default(targetUser.permissions?.manageMembers || false),
    manageEvents: z
      .boolean()
      .default(targetUser.permissions?.manageEvents || false),
    manageMemberships: z
      .boolean()
      .default(targetUser.permissions?.manageMemberships || false),
    manageClub: z
      .boolean()
      .default(targetUser.permissions?.manageClub || false),
  });

  if (!rootData?.user?.superuser) {
    UserModel = UserModel.extend({
      manageMemberships: UserModel.shape.manageMemberships.readonly(),
      manageClub: UserModel.shape.manageClub.readonly(),
      manageEvents: UserModel.shape.manageEvents.readonly(),
      manageMembers: UserModel.shape.manageMembers.readonly(),
    }) as unknown as typeof UserModel; // Type hack to make TS happy, it's a very minor type conflict and not really worth fixing, it should have no net effect on runtime type safety.
  }

  return (
    <Form schema={UserModel}>
      {({ Field, Errors, Button, register }) => (
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">
            Edit Member - {targetUser.firstName} {targetUser.lastName}{" "}
            {targetUser.preferredName && `${targetUser.preferredName}`}
          </h2>
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
          <h3 className="text-xl font-bold">Permissions</h3>
          <Field name="manageMembers" label="Manage Members" />
          <Field name="manageEvents" label="Manage Events" />
          <Field name="manageMemberships" label="Manage Memberships" />
          <Field name="manageClub" label="Manage Club" />
          <Errors />
          <Button>Save Changes</Button>
        </div>
      )}
    </Form>
  );
}
