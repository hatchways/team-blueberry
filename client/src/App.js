import React, { useReducer } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import reducer from "./reducers";
import initState from "./initState";

import { userContext } from "./userContext";
import { theme } from "./themes/theme";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import OnBoard from "./pages/OnBoard";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";
import Balance from "./pages/Balance";

import "./App.css";

function App() {
  const [state, dispatch] = useReducer(reducer, {}, initState);

  return (
    <userContext.Provider value={{ state, dispatch }}>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={Login} />
            <Route path="/" exact component={SignUp} />
            <ProtectedRoute condition={() => state.user.id}>
              <Route path="/onboard" component={OnBoard} />
              <Route path="/profile" component={Profile} />
              <Route path="/reviews" component={Reviews} />
              <Route path="/balance" component={Balance} />
            </ProtectedRoute>
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </userContext.Provider>
  );
}

export default App;
