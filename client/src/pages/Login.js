import React, { useState } from "react";
import axios from "axios";
//Material-ui imports
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
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
import Alert from "../elements/Alert";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
    textAlign: "center",
  },
}));

export default function SignIn(props) {
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
      axios({
        method: "POST",
        data: {
          email: loginEmail,
          password: loginPassword,
        },
        withCredentials: true,
        url: "http://localhost:3001/api/login",
      })
        .then((res) => {
          props.history.push("/");
        })
        .catch((error) => {
          //If getting 409 - raise email error
          if (error.response.data === "Incorrect email and password") {
            setLoginError(error.response.data);
          }
        });
    }
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
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">Forgot?</InputAdornment>
                    ),
                  }}
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
                  display={loginError ? "block" : "none"}
                  onClick={() => setLoginError(false)}
                >
                  {loginError}
                </Alert>
              </Grid>
            </Grid>
            <SubmitButton onClick={loginHandler}>Login</SubmitButton>
          </form>
          <Box mt={5}>
            <Grid container direction="row" justify="center" spacing={1}>
              <Grid item>
                <Typography component="h1" variant="h6">
                  Don't have an account?
                </Typography>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="h6">
                  {"Create"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>
      </Container>
    </Background>
  );
}
