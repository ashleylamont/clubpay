import type { ThemeOptions } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";


export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#003236',
    },
    secondary: {
      main: '#e60c26',
    },
    background: {
      default: '#f4fafd',
      paper: '#f4fafd',
    },
    text: {
      primary: '#003236',
    },
  },
  typography: {
    h1: {
      fontFamily: 'Wix Madefor Display',
    },
  },
};

export const theme = createTheme(themeOptions);
