import React, { useState } from 'react';
//Material-ui imports
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
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

  // DO WE LOG IN BY USERNAME OR EMAIL???
  const [ loginUsername, setLoginUsername ] = useState('');
  const [ loginPassword, setLoginPassword ] = useState('');
  const [ submitClicked, setSubmitClicked ] = useState(false);

  const loginHandler = (event) => {
    event.preventDefault();
    if (!loginUsername || !loginPassword) {
      setSubmitClicked(true);
    } else {
      console.log(`Send login request to API ${loginUsername} ${loginPassword}`);
    }
    // Here goes login logic after we get server routes
    // Axios({
    //   method: 'POST',
    //   data: {
    //     username: loginUsername,
    //     password: loginPassword
    //   },
    //   withCredentials: true,
    //   url: 'http://localhost:3001/login'
    // }).then((res) => {
    //   if (res.data === 'Successfully Authenticated') {
    //     window.location.href = '/'; //There must be a way to redirect with React, history.push() doesn't work correctly
    //   } else {
    //     console.log(res.data); //
    //   }
    // });
  };

  return (
    <Background gradient>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper elevation={3} className={classes.paper}>
          <Box mt={5} fontSize="h4.fontSize" fontWeight="fontWeightBold">
            Welcome back!
          </Box>
          <form className={classes.form}>
            <Grid direction="column" justify="center" container spacing={1}>
              <Grid item>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  error={submitClicked && !loginUsername ? true : false}
                  helperText={submitClicked && !loginUsername ? 'Field can not be blank' : null}
                  onChange={(e) => setLoginUsername(e.target.value)}
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
                    endAdornment: <InputAdornment position="end">Forgot?</InputAdornment>
                  }}
                  error={submitClicked && !loginPassword ? true : false}
                  helperText={submitClicked && !loginPassword ? 'Field can not be blank' : null}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              size="large"
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={loginHandler}
            >
              Login
            </Button>
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
                  {'Create'}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Background>
  );
}
