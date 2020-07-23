import React, { useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import reducer from "./reducers";
import initState from "./initState"

import { userContext } from "./userContext";
import { theme } from "./themes/theme";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import "./App.css";

function App() {
  const [state, dispatch] = useReducer(reducer, {}, initState);

  return (
    <userContext.Provider value={state.user}>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={Login} />
            <Route path="/" exact component={SignUp} />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </userContext.Provider>
  );
}

export default App;
