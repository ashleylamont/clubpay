import { prisma } from "~/services/db.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { makeDomainFunction } from "domain-functions";
import { formAction } from "~/services/form-action.server";
import { Form } from "~/components/forms/form";

export const schema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  logoUrl: z.string().nullable(),
  bannerUrl: z.string().nullable(),
});

export async function loader() {
  const club = await prisma.club.findFirstOrThrow({
    where: {
      id: "club",
    },
  });
  return json(club);
}

const mutation = makeDomainFunction(schema)(async (data) => {
  const clubData = schema.parse(data);
  try {
    await prisma.club.update({
      where: {
        id: "club",
      },
      data: clubData,
    });
  } catch (e) {
    console.error(e);
    throw "Error updating club";
  }
  return json({ success: true });
});

export async function action({ request }: ActionFunctionArgs) {
  return formAction({
    request,
    schema,
    mutation,
    successPath: "/manage/club",
  });
}

export default function ManageClub() {
  const club = useLoaderData<typeof loader>();
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Manage {club.name}</h1>
      <Form
        schema={schema}
        values={club}
        buttonLabel="Save club"
        multiline={["description"]}
      />
    </>
  );
}
