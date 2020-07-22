import { createMuiTheme } from '@material-ui/core';

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 12,

    h1: {
      // could customize the h1 variant as well
    }
  },
  palette: {
    primary: {
      main: '#43DDC1',
      white: '#fff'
    },
    secondary: {
      main: '#fff'
    },
    background: {
      gradient: 'linear-gradient(to bottom, #778ae0, #6e3adb)',
      //gradient: 'linear-gradient(to bottom, #6E3ADB, #501CBD)',
      solid: '#D3D3D3'
    },
    navbar: '#501CBD',
    divider: '#000000',
    profile: '#fff',
    boxShadow: '0 3px 5px 2px #888888'
  },
  spacing: 8
});
