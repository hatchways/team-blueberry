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
    <userContext.Provider value={state.user}>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={Login} />
            <Route path="/onboard" component={OnBoard} />
            <Route path="/" exact component={SignUp} />
            {/* Need the login api */}
            <ProtectedRoute
              condition={() => state.user.id}
              path="/profile"
              component={Profile}
            />
            <ProtectedRoute
              condition={() => state.user.id}
              path="/balance"
              component={Balance}
            />
            <ProtectedRoute
              condition={() => state.user.id}
              path="/reviews"
              component={Reviews}
            />
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </userContext.Provider>
  );
}

export default App;
