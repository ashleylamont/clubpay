import { Box, Grid, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import TextInput from "~/components/input/textInput";
import SubmitButton from "~/components/input/submitButton";
import type { DataFunctionArgs } from "@remix-run/server-runtime";
import { requireLoggedIn, requireLoggedInDirect } from "~/user.session.server";
import { prisma } from "~/db.server";
import { redirect } from "@remix-run/node";

const validator = withZod(
  z.object({
    clubName: z
    .string()
    .min(1, "Club name is required")
    .max(50, "Club name must be less than 50 characters"),
    description: z
    .string()
    .min(1, "Description is required"),
    imageUrl: z
    .string()
    .url()
  })
);

export async function action({
                               request
                             }: DataFunctionArgs) {
  const user = await requireLoggedInDirect(request);
  const result = await validator.validate(
    await request.formData()
  );

  if (result.error) {
    // validationError comes from `remix-validated-form`
    return validationError(result.error);
  }

  const { clubName, imageUrl, description } = result.data;

  const club = await prisma.club.create({
    data: {
      name: clubName,
      description: description,
      logoUrl: imageUrl,
      status: "PRIVATE"
    }
  });

  await prisma.manager.create({
    data: {
      userId: user.id,
      clubId: club.id,
      manageClub: true,
      createMembers: true,
      manageMembers: true
    }
  });

  return redirect("/app/clubs/" + club.id);
};

export function loader({ request }: DataFunctionArgs) {
  return requireLoggedIn(request);
}

export default function NewClub() {
  return (
    <Box sx={{ flexGrow: 1, padding: "10px" }}>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12} sm={8} md={6} xl={4}>
          <Paper sx={{ padding: "15px" }}>
            <Typography variant="h4">New Club</Typography>
            <ValidatedForm validator={validator} method="post">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextInput fullWidth name="clubName" label="Club Name" />
                </Grid>
                <Grid item xs={12}>
                  <TextInput fullWidth multiline minRows={4} name="description"
                             label="Description" />
                </Grid>
                <Grid item xs={12}>
                  <TextInput fullWidth name="imageUrl" label="Club Logo URL" />
                </Grid>
                <Grid item xs={12}>
                  <SubmitButton variant="contained" />
                </Grid>
              </Grid>
            </ValidatedForm>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
