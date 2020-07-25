import React, { useState } from "react";
import axios from "axios";
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
import StyledPaper from "../elements/StyledPaper";
import PageHeader from "../elements/PageHeader";
import SubmitButton from "../elements/SubmitButton";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
    textAlign: "center",
  },
}));

export default function SignIn(props) {
  const classes = useStyles();

  // ========== FORM VALIDATION LOGIC BEGIN ==========

  const [username, setUsername] = useState({
    value: "",
    error: "Field can not be blank",
    touched: false,
  });
  const [email, setEmail] = useState({
    value: "",
    error: "Field can not be blank",
    touched: false,
  });
  const [password, setPassword] = useState({
    value: "",
    error: "Field can not be blank",
    touched: false,
  });
  const [repeatedPassword, setRepeatedPassword] = useState({
    value: "",
    error: "Field can not be blank",
    touched: false,
  });

  // Validate username
  const usernameHandler = (event) => {
    const usernameRegex = /^[a-zA-Z0-9-]+$/;
    let errorFound = "";
    if (event.target.value.length < 4 || event.target.value.length > 20) {
      errorFound = "Username length should be 4-20 chars long";
    } else if (!event.target.value.match(usernameRegex)) {
      errorFound = 'Only letters, numbers and  "-" are  acceptable';
    }
    setUsername({
      value: event.target.value,
      touched: true,
      error: errorFound,
    });
  };

  // Validate email
  const emailHandler = (event) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errorFound = "";
    if (!event.target.value.match(emailRegex)) {
      errorFound = "Incorrect email address";
    }
    setEmail({
      value: event.target.value,
      touched: true,
      error: errorFound,
    });
  };

  //Validate password
  const passwordHandler = (event) => {
    let errorFound = null;

    switch (true) {
      case event.target.value.length < 6:
        errorFound = "Password must be at least 6 characters long";
        break;
      //Check is password and repeatedPassword are equal after user changes one or another
      case repeatedPassword.value &&
        event.target.value !== repeatedPassword.value:
        setRepeatedPassword((prev) => {
          return {
            value: prev.value,
            error: "Passwords do not match",
            touched: true,
          };
        });
        break;
      case repeatedPassword.value &&
        repeatedPassword.error === "Passwords do not match" &&
        event.target.value === repeatedPassword.value:
        setRepeatedPassword((prev) => {
          return {
            value: prev.value,
            error: null,
            touched: true,
          };
        });
        break;
      default:
        break;
    }

    setPassword({
      value: event.target.value,
      error: errorFound,
      touched: true,
    });
  };

  // Validate repeated password
  const repeatedPasswordHandler = (event) => {
    setRepeatedPassword({
      value: event.target.value,
      error:
        event.target.value === password.value ? null : "Passwords do not match",
      touched: true,
    });
  };

  // ========== FORM VALIDATION LOGIC END ==========

  //Submit button logic
  const [submitClicked, setSubmitClicked] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();

    //Check if all fields are valid
    if (
      !username.touched ||
      !email.touched ||
      !password.touched ||
      !repeatedPassword.touched ||
      username.error ||
      email.error ||
      password.error ||
      repeatedPassword.error
    ) {
      console.log("NOT PASS");
      setSubmitClicked(true);
    } else {
      axios({
        method: "POST",
        data: {
          email: email.value,
          name: username.value,
          password: password.value,
          confirmPassword: repeatedPassword.value,
        },
        withCredentials: true,
        url: "http://localhost:3001/api/register",
      })
        .then((res) => {
          props.history.push("/onboard");
        })
        .catch((error) => {
          //If getting 409 - raise email error
          if (error.response.data === "Email already exist!") {
            setEmail((prev) => {
              return {
                value: prev.value,
                error: error.response.data,
                touched: true,
              };
            });
          }
        });
    }
  };
  return (
    <Background gradient>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <StyledPaper mt={20}>
          <PageHeader>Create an account</PageHeader>
          <form className={classes.form}>
            <Grid direction="column" justify="center" container spacing={1}>
              <Grid item>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="username"
                  label="User name"
                  name="email"
                  error={
                    username.error && (username.touched || submitClicked)
                      ? true
                      : false
                  }
                  helperText={
                    (username.touched || submitClicked) && username.error
                  }
                  onChange={usernameHandler}
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  error={
                    email.error && (email.touched || submitClicked)
                      ? true
                      : false
                  }
                  helperText={(email.touched || submitClicked) && email.error}
                  onChange={emailHandler}
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
                  error={
                    password.error && (password.touched || submitClicked)
                      ? true
                      : false
                  }
                  helperText={
                    (password.touched || submitClicked) && password.error
                  }
                  onChange={passwordHandler}
                />
              </Grid>
              <Grid item>
                <TextField
                  variant="outlined"
                  fullWidth
                  name="repeatPassword"
                  label="Repeat Password"
                  type="password"
                  id="repeatPassword"
                  error={
                    repeatedPassword.error &&
                    (repeatedPassword.touched || submitClicked)
                      ? true
                      : false
                  }
                  helperText={
                    (repeatedPassword.touched || submitClicked) &&
                    repeatedPassword.error
                  }
                  onChange={repeatedPasswordHandler}
                />
              </Grid>
            </Grid>
            <SubmitButton onClick={submitHandler}>Continue</SubmitButton>
          </form>
          <Box mt={5}>
            <Grid container direction="row" justify="center" spacing={1}>
              <Grid item>
                <Typography component="h1" variant="h6">
                  Already have an account?
                </Typography>
              </Grid>
              <Grid item>
                <Link href="/login" variant="h6">
                  {"Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </StyledPaper>
      </Container>
    </Background>
  );
}
