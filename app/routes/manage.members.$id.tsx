import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { prisma } from "~/services/db.server";
import { useLoaderData } from "@remix-run/react";
import SelectComponent from "~/components/forms/selectComponent";
import { Form } from "~/components/forms/form";
import { z } from "zod";
import { RiAlertLine } from "@remixicon/react";

const UserModel = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  preferredName: z.string().nullable(),
  email: z.string().email(),
  pronouns: z
    .union([
      z.literal("HE_HIM"),
      z.literal("SHE_HER"),
      z.literal("THEY_THEM"),
      z.literal("OTHER"),
    ])
    .nullable(),
  otherPronouns: z.string().nullable(),
  manageMembers: z.boolean(),
  manageEvents: z.boolean(),
  manageMemberships: z.boolean(),
  manageClub: z.boolean(),
});

export async function loader({ params, context, request }: LoaderFunctionArgs) {
  // Check if current user has permission to manage members
  // If not, redirect to home
  const 
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

export async function action({ request, params }: LoaderFunctionArgs) {
  const data = await request.formData();
  const existingUser = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
  });
  const userData = UserModel.parse(Object.fromEntries(data.entries()));
  const user = await prisma.user.update({
    where: {
      id: params.id,
    },
    data: {
      firstName: userData.firstName,
      lastName: userData.lastName,
      preferredName: userData.preferredName,
      email: userData.email,
      pronouns: userData.pronouns,
      otherPronouns: userData.otherPronouns,
      permissions: {
        update: {
          manageMembers: userData.manageMembers && !existingUser.superuser,
          manageEvents: userData.manageEvents,
          manageMemberships: userData.manageMemberships,
          manageClub: userData.manageClub,
        },
      },
    },
  });
  return json({ user });
}

export default function ManageMember() {
  const loaderData = useLoaderData<typeof loader>();
  const targetUser = loaderData?.user;

  if (!targetUser) {
    return <div>User not found</div>;
  }

  return (
    <Form
      schema={UserModel}
      values={{
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        preferredName: targetUser.preferredName,
        email: targetUser.email,
        pronouns: targetUser.pronouns,
        otherPronouns: targetUser.otherPronouns,
        manageMembers:
          targetUser.permissions?.manageMembers ||
          targetUser.superuser ||
          false,
        manageEvents:
          targetUser.permissions?.manageEvents || targetUser.superuser || false,
        manageMemberships:
          targetUser.permissions?.manageMemberships ||
          targetUser.superuser ||
          false,
        manageClub:
          targetUser.permissions?.manageClub || targetUser.superuser || false,
      }}
    >
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
          {targetUser.superuser ? (
            <div className="alert alert-warning">
              <RiAlertLine size={24} />
              This user is a superuser and has all permissions.
            </div>
          ) : (
            <>
              <Field name="manageMembers" label="Manage Members" />
              <Field name="manageEvents" label="Manage Events" />
              <Field name="manageMemberships" label="Manage Memberships" />
              <Field name="manageClub" label="Manage Club" />
            </>
          )}
          <Errors />
          <Button>Save Changes</Button>
        </div>
      )}
    </Form>
  );
}
