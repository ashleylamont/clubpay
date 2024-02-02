import { Form } from "~/components/forms/form";
import { makeDomainFunction } from "domain-functions";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { checkPermission, PERMISSION } from "~/services/auth/auth.server";
import { formAction } from "~/services/form-action.server";
import { prisma } from "~/services/db.server";
import { schema } from "./manage.club._index";
export async function loader() {
  const existingClubs = await prisma.club.count();
  if (existingClubs > 0) {
    return redirect("/manage/club");
  }
  return null;
}

const mutation = makeDomainFunction(schema)(async (data) => {
  const existingClubs = await prisma.club.count();
  if (existingClubs > 0) {
    throw "Club already exists";
  }
  const clubData = schema.parse(data);
  try {
    await prisma.club.create({
      data: clubData,
    });
  } catch (e) {
    console.error(e);
    throw "Error creating club";
  }
  return json({ success: true });
});

export async function action({ request }: ActionFunctionArgs) {
  const hasPermission = await checkPermission(request, PERMISSION.MANAGE_CLUB);
  if (!hasPermission) {
    return json({ error: "You do not have permission to do that" }, 403);
  }
  return formAction({ request, schema, mutation, successPath: "/manage/club" });
}

export default function ManageClub() {
  return (
    <>
      <h1 className="text-2xl font-bold">Create a new club</h1>
      <Form
        className="min-w-lg"
        schema={schema}
        multiline={["description"]}
        buttonLabel="Create club"
      ></Form>
    </>
  );
}
