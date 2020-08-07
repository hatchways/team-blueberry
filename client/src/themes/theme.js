import { createMuiTheme } from "@material-ui/core";

export const theme = createMuiTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 12,

    h1: {
      // could customize the h1 variant as well
    },
  },
  palette: {
    primary: {
      main: "#43DDC1",
      white: "#fff",
    },
    secondary: {
      main: "#6E3ADB",
    },
    button: {
      default: "#43DDC1",
      remove: "#fa8072",
    },
    background: {
      gradient: "linear-gradient(to bottom, #778ae0, #6e3adb)",
      solid: "#ecf0fa",
      inAppBackdrop: "#ecf0fa",
    },
    navbar: "#501CBD",
    divider: "#000000",
    profile: "#fff",
    boxShadow: "0 3px 5px 2px #888888",
  },
  spacing: 8,
});
