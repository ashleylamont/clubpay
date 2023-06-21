import { Grid, Paper, Box, Card, CardMedia, CardContent, CardActions, Chip } from "@mui/material";
import Typography from "@mui/material/Typography";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { getSession, requireLoggedIn, USER_EMAIL_KEY } from "~/user.session.server";
import { prisma } from "~/db.server";
import { json } from "@remix-run/node";
import type { GetLoaderDataType } from "~/utils";
import { Link, useLoaderData } from "@remix-run/react";
import Button from "@mui/material/Button";

export async function loader({ request }: LoaderArgs) {
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
  });
  return json(user);
}

export default function Clubs() {
  const user: GetLoaderDataType<typeof loader> = useLoaderData();
  if (user === null) {
    throw new Error("User not found");
  }
  return (
    <Box sx={{ flexGrow: 1, padding: "10px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ padding: "15px" }}>
            <Typography variant="h4">Clubs</Typography>
            {user.managers.length === 0 ? <>
              <Typography variant="h5">You do not manage any clubs</Typography>
            </> : <Grid container spacing={2}>
              {user.managers.map(manager => (
                <Grid key={manager.club.id} item xs={12} sm={6} md={4} lg={3} xl={2} sx={{marginTop: '10px', marginBottom: '20px'}}>
                  <Card>
                    {manager.club.logoUrl && <CardMedia
                      component="img"
                      height="140"
                      sx={{ objectFit: "cover", maxHeight: "140px" }}
                      image={manager.club.logoUrl}
                      alt={manager.club.name}
                    />}
                    <CardContent>
                      <Chip label={manager.club.status} size="small" />
                      <Typography gutterBottom variant="h5" component="div">
                        {manager.club.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {manager.club.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Link to={`/app/clubs/${manager.club.id}`}>
                        <Button size="small">Manage</Button>
                      </Link>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>}
            <Link to="/app/clubs/new">
              <Button variant="contained">Create new club</Button>
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
