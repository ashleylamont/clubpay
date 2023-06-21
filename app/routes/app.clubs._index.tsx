import { Grid, Paper, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { LoaderArgs } from "@remix-run/server-runtime";
import { getSession, requireLoggedIn, USER_EMAIL_KEY } from "~/user.session.server";
import { prisma } from "~/db.server";
import { json } from "@remix-run/node";
import { GetLoaderDataType } from "~/utils";
import { Link, useLoaderData } from "@remix-run/react";
import Button from "@mui/material/Button";

export async function loader({request}: LoaderArgs) {
  await requireLoggedIn(request);
  const session = await getSession(request);
  const user = await prisma.user.findUnique({
    where: {
      email: session.get(USER_EMAIL_KEY)
    },
    include: {
      managers: {
        include: {
          club: true
        }
      }
    }
  })
  return json(user);
}

export default function Clubs() {
  const user: GetLoaderDataType<typeof loader> = useLoaderData();
  if (user === null) {
    throw new Error("User not found");
  }
  return (
    <Box sx={{ flexGrow: 1, padding: '10px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{padding: '15px'}}>
            <Typography variant="h4">Clubs</Typography>
            {user.managers.length === 0 ? <>
              <Typography variant="h5">You do not manage any clubs</Typography>
            </> : <>
            {user.managers.map(manager => (
              <Typography key={manager.id} variant="h5">{manager.club.name}</Typography>
            ))}
            </>}
            <Link to="/app/clubs/new">
              <Button variant="contained">Create new club</Button>
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
