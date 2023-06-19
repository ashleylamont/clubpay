import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Tooltip,
  Typography
} from "@mui/material";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import appConfig from "../../app.config";

export interface AppMenuProps {
  userName: string;
  userPhoto: string | null;
  fallbackProfile: string;
}

export default function AppMenu({
                                  userName,
                                  userPhoto,
                                  fallbackProfile
                                }: AppMenuProps): JSX.Element {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LocalActivityIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "sans-serif",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none"
            }}
          >
            {appConfig.appName}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          {/*  <IconButton*/}
          {/*    size="large"*/}
          {/*    aria-label="account of current user"*/}
          {/*    aria-controls="menu-appbar"*/}
          {/*    aria-haspopup="true"*/}
          {/*    onClick={handleOpenNavMenu}*/}
          {/*    color="inherit"*/}
          {/*  >*/}
          {/*    <MenuIcon />*/}
          {/*  </IconButton>*/}
          {/*  <Menu*/}
          {/*    id="menu-appbar"*/}
          {/*    anchorEl={anchorElNav}*/}
          {/*    anchorOrigin={{*/}
          {/*      vertical: "bottom",*/}
          {/*      horizontal: "left"*/}
          {/*    }}*/}
          {/*    keepMounted*/}
          {/*    transformOrigin={{*/}
          {/*      vertical: "top",*/}
          {/*      horizontal: "left"*/}
          {/*    }}*/}
          {/*    open={Boolean(anchorElNav)}*/}
          {/*    onClose={handleCloseNavMenu}*/}
          {/*    sx={{*/}
          {/*      display: { xs: "block", md: "none" }*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    {pages.map((page) => (*/}
          {/*      <MenuItem key={page} onClick={handleCloseNavMenu}>*/}
          {/*        <Typography textAlign="center">{page}</Typography>*/}
          {/*      </MenuItem>*/}
          {/*    ))}*/}
          {/*  </Menu>*/}
          {/*</Box>*/}
          {/*<AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />*/}
          {/*<Typography*/}
          {/*  variant="h5"*/}
          {/*  noWrap*/}
          {/*  component="a"*/}
          {/*  href=""*/}
          {/*  sx={{*/}
          {/*    mr: 2,*/}
          {/*    display: { xs: "flex", md: "none" },*/}
          {/*    flexGrow: 1,*/}
          {/*    fontFamily: "monospace",*/}
          {/*    fontWeight: 700,*/}
          {/*    letterSpacing: ".3rem",*/}
          {/*    color: "inherit",*/}
          {/*    textDecoration: "none"*/}
          {/*  }}*/}
          {/*>*/}
          {/*  LOGO*/}
          {/*</Typography>*/}
          {/*<Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>*/}
          {/*  {pages.map((page) => (*/}
          {/*    <Button*/}
          {/*      key={page}*/}
          {/*      onClick={handleCloseNavMenu}*/}
          {/*      sx={{ my: 2, color: "white", display: "block" }}*/}
          {/*    >*/}
          {/*      {page}*/}
          {/*    </Button>*/}
          {/*  ))}*/}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {/*<Tooltip title="Open settings">*/}
            <IconButton onClick={/*handleOpenUserMenu*/() => {
            }} sx={{ p: 0 }}>
              <Avatar alt={userName}
                      src={userPhoto ?? `data:image/png;base64,${fallbackProfile}`} />
            </IconButton>
            {/*</Tooltip>*/}
            {/*<Menu*/}
            {/*  sx={{ mt: "45px" }}*/}
            {/*  id="menu-appbar"*/}
            {/*  anchorEl={anchorElUser}*/}
            {/*  anchorOrigin={{*/}
            {/*    vertical: "top",*/}
            {/*    horizontal: "right"*/}
            {/*  }}*/}
            {/*  keepMounted*/}
            {/*  transformOrigin={{*/}
            {/*    vertical: "top",*/}
            {/*    horizontal: "right"*/}
            {/*  }}*/}
            {/*  open={Boolean(anchorElUser)}*/}
            {/*  onClose={handleCloseUserMenu}*/}
            {/*>*/}
            {/*  {settings.map((setting) => (*/}
            {/*    <MenuItem key={setting} onClick={handleCloseUserMenu}>*/}
            {/*      <Typography textAlign="center">{setting}</Typography>*/}
            {/*    </MenuItem>*/}
            {/*  ))}*/}
            {/*</Menu>*/}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
