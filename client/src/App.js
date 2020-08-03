import React, { useReducer, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import reducer from "./reducers";
import initState from "./initState";
import userContext from "./userContext";
import { theme } from "./themes/theme";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import OnBoard from "./pages/OnBoard";
import { userGet } from "./services/userService";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";
import Balance from "./pages/Balance";
import Checkout from "./pages/Checkout";

import "./App.css";

function App() {
  const [state, dispatch] = useReducer(reducer, {}, initState);

  useEffect(() => {
    userGet()(dispatch);
  }, [dispatch]);
  console.log(state);

  // Maybe we should wrap it this way?
  // if (state.loading) {
  //   return "Loading";
  // } else { }
  return (
    <userContext.Provider value={state.user}>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route path="/signup" component={SignUp} />
            <Route path="/login" component={Login} />
            <ProtectedRoute condition={() => state.user._id} path="/onboard">
              <OnBoard state={state} dispatch={dispatch} />
            </ProtectedRoute>
            <Route path="/" exact component={SignUp} />
            <ProtectedRoute condition={() => state.user._id} path="/profile">
              <Profile state={state} dispatch={dispatch} />
            </ProtectedRoute>
            <ProtectedRoute condition={() => state.user._id} path="/reviews">
              <Reviews state={state} dispatch={dispatch} />
            </ProtectedRoute>
            <ProtectedRoute condition={() => state.user._id} path="/balance">
              <Balance state={state} dispatch={dispatch} />
            </ProtectedRoute>
            <ProtectedRoute
              condition={() => state.user.id && state.cart.length}
              path="/checkout"
              // creates a failover: first to balance then to login
              redirect="/balance"
            >
              <Checkout state={state} dispatch={dispatch} />
            </ProtectedRoute>
          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    </userContext.Provider>
  );
}

export default App;
