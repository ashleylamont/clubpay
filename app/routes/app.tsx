import type { LoaderArgs } from "@remix-run/node";
import { requireLoggedIn } from "~/user.session.server";
import { Grid, ThemeProvider } from "@mui/material";
import AppMenu from "~/components/appMenu";
import { theme } from "~/muiStyle";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { User } from "@prisma/client";

export async function loader({ request }: LoaderArgs) {
  return requireLoggedIn(request);
}


export default function App_index(): JSX.Element {
  const user: User & {fallbackProfile: string} = useLoaderData();
  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid item xs={12}>
          <AppMenu userName={user.name ?? 'Name not found'} userPhoto={user.avatarUrl} fallbackProfile={user.fallbackProfile}/>
        </Grid>
        <Grid item xs={12}>
          <Outlet />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
