import React, { useState } from "react";
import userLogin from "../services/login";
import { Link as RouterLink } from "react-router-dom";
//Material-ui imports
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Background from "../elements/Background";
import PageHeader from "../elements/PageHeader";
import SubmitButton from "../elements/SubmitButton";
import StyledPaper from "../elements/StyledPaper";
import Alert from "../elements/SnackBar";
import { usersData } from "../guestData";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
    textAlign: "center",
  },
}));

export default function Login({ state, dispatch }) {
  const classes = useStyles();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [submitClicked, setSubmitClicked] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const loginHandler = (event) => {
    event.preventDefault();
    if (!loginEmail || !loginPassword) {
      setSubmitClicked(true);
    } else {
      if (loginEmail !== "guest@guest.guest" && loginPassword !== "guest2020") {
        userLogin(loginEmail, loginPassword, dispatch).catch((error) => {
          setLoginError(error.message);
        });
      } else {
        dispatch({
          type: "LOGIN",
          user: usersData.guest,
        });
      }
    }
  };

  const guestLogin = () => {
    setLoginEmail("guest@guest.guest");
    setLoginPassword("guest2020");
  };

  return (
    <Background gradient>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <StyledPaper mt={20}>
          <PageHeader>Welcome back!</PageHeader>
          <form className={classes.form}>
            <Grid direction="column" justify="center" container spacing={1}>
              <Grid item>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="E-mail Address"
                  name="email"
                  value={loginEmail}
                  autoComplete="email"
                  error={submitClicked && !loginEmail ? true : false}
                  helperText={
                    submitClicked && !loginEmail
                      ? "Field can not be blank"
                      : null
                  }
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  fullWidth
                  name="password"
                  value={loginPassword}
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={submitClicked && !loginPassword ? true : false}
                  helperText={
                    submitClicked && !loginPassword
                      ? "Field can not be blank"
                      : null
                  }
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </Grid>
              <Grid item>
                <Alert
                  open={loginError ? true : false}
                  onClick={() => setLoginError(false)}
                >
                  {loginError}
                </Alert>
              </Grid>
            </Grid>
            <SubmitButton onClick={loginHandler}>Login</SubmitButton>
          </form>
          <Box mt={3}>
            <Grid container direction="row" justify="center" spacing={1}>
              <Grid item>
                <Typography component="h1" variant="h6">
                  Don't have an account?
                </Typography>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="h6">
                  {"Create"}
                </Link>
              </Grid>
            </Grid>
            <Grid container direction="row" justify="center" spacing={1}>
              <Grid item>
                <Typography variant="subtitle1">or just log in as a</Typography>
              </Grid>
              <Grid item>
                <Link
                  component={RouterLink}
                  to="#"
                  onClick={guestLogin}
                  variant="subtitle1"
                >
                  {"Guest"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>
      </Container>
    </Background>
  );
}
