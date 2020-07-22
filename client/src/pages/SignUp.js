import React, { useState } from 'react';
//Material-ui imports
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Background from '../elements/Background';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(20),
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  headerText: {
    marginTop: theme.spacing(10)
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
    textAlign: 'center'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1, 6),
    border: 0,
    borderRadius: 25,
    color: '#fff',
    textTransform: 'none',
    fontSize: 15
  }
}));

export default function SignIn() {
  const classes = useStyles();

  // ========== FORM VALIDATION LOGIC BEGIN ==========

  // Validate username
  const [ username, setUsername ] = useState({
    value: '',
    error: 'Field can not be blank',
    touched: false
  });

  const usernameHandler = (event) => {
    const usernameRegex = /^[a-zA-Z0-9-]+$/;
    let errorFound = '';
    if (event.target.value.length < 4 || event.target.value.length > 16) {
      errorFound = 'Username length should be 4-16 chars long';
    } else if (!event.target.value.match(usernameRegex)) {
      errorFound = 'Only letters, numbers and  "-" are  acceptable';
    }
    setUsername({
      value: event.target.value,
      touched: true,
      error: errorFound
    });
  };

  // Validate email
  const [ email, setEmail ] = useState({
    value: '',
    error: 'Field can not be blank',
    touched: false
  });

  const emailHandler = (event) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let errorFound = '';
    if (!event.target.value.match(emailRegex)) {
      errorFound = 'Incorrect email address';
    }
    setEmail({
      value: event.target.value,
      touched: true,
      error: errorFound
    });
  };

  //Validate password
  const [ password, setPassword ] = useState({
    value: '',
    error: 'Field can not be blank',
    touched: false
  });

  const passwordHandler = (event) => {
    let errorFound = null;
    if (event.target.value.length < 6) {
      errorFound = 'Password must be at least 6 characters long';
    } else if (!event.target.value.match(/(?=.*[a-z])/)) {
      errorFound = 'Password must contain at least one lower case letter';
    } else if (!event.target.value.match(/(?=.*\d)/)) {
      errorFound = 'Password must contain at least one digit';
    } else if (!event.target.value.match(/(?=.*[A-Z])/)) {
      errorFound = 'Password must contain at least one upper case letter';
    } else if (!event.target.value.match(/(?=.*[!@#$%^&*])/)) {
      errorFound = 'Password must contain at least one special char';
    } else if (repeatedPassword.value && event.target.value !== repeatedPassword.value) {
      errorFound = 'Passwords do not match';
    }

    setPassword({
      value: event.target.value,
      error: errorFound,
      touched: true
    });
  };

  // Validate repeated password
  const [ repeatedPassword, setRepeatedPassword ] = useState({
    value: '',
    error: 'Field can not be blank',
    touched: false
  });

  const repeatedPasswordHandler = (event) => {
    setRepeatedPassword({
      value: event.target.value,
      error: event.target.value === password.value ? null : 'Passwords do not match',
      touched: true
    });
  };

  // ========== FORM VALIDATION LOGIC END ==========

  //Submit button logic
  const [ submitClicked, setSubmitClicked ] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();

    //Check if all fields valid
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
      console.log('NOT PASS');
      setSubmitClicked(true);
    } else {
      //here goes submit logic after i get API routes
      console.log('SEND SUBMIT');
    }
  };
  return (
    <Background gradient>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper elevation={3} className={classes.paper}>
          <Box mt={5} fontSize="h4.fontSize" fontWeight="fontWeightBold">
            Create an account
          </Box>
          <form className={classes.form}>
            <Grid direction="column" justify="center" container spacing={1}>
              <Grid item>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="username"
                  label="User name"
                  name="email"
                  error={username.error && (username.touched || submitClicked) ? true : false}
                  helperText={(username.touched || submitClicked) && username.error}
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
                  error={email.error && (email.touched || submitClicked) ? true : false}
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
                  error={password.error && (password.touched || submitClicked) ? true : false}
                  helperText={(password.touched || submitClicked) && password.error}
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
                  error={repeatedPassword.error && (repeatedPassword.touched || submitClicked) ? true : false}
                  helperText={(repeatedPassword.touched || submitClicked) && repeatedPassword.error}
                  onChange={repeatedPasswordHandler}
                />
              </Grid>
            </Grid>
            <Button
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={submitHandler}
            >
              Continue
            </Button>
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
                  {'Sign In'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Background>
  );
}
