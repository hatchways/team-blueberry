import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { theme } from './themes/theme';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

import './App.css';

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <BrowserRouter>
        <Switch>
          <Route path="/signup" component={SignUp} />
          <Route path="/login" component={Login} />
          <Route path="/" exact component={SignUp} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
