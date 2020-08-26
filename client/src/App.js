import React, { useReducer, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import reducer from "./reducers";
import initState from "./initState";
import userContext from "./userContext";
import loadingContext from "./loadingContext";
import { theme } from "./themes/theme";
import { ProtectedRoute, ProtectedElement } from "./components/Protected";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import OnBoard from "./pages/OnBoard";
import { userGet } from "./services/userService";
import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";
import Balance from "./pages/Balance";
import Checkout from "./pages/Checkout";

import Loading from "./elements/Loading";

import "./App.css";

function App() {
  const [state, dispatch] = useReducer(reducer, {}, initState);

  useEffect(() => {
    userGet()(dispatch);
    return () => dispatch("FINISH_LOAD");
  }, [dispatch]);

  return (
    <userContext.Provider value={state.user}>
      <loadingContext.Provider value={state.loading}>
        <MuiThemeProvider theme={theme}>
          {state.loading ? (
            <Loading />
          ) : (
            <BrowserRouter>
              <ProtectedElement
                // ! must remain within Router
                // ? still don't like the location condition, but unsure of how to handle index
                condition={() =>
                  state.user.id && state.user.languages.length !== 0
                }
              >
                <Navbar state={state} dispatch={dispatch} />
              </ProtectedElement>
              <Switch>
                <ProtectedRoute
                  condition={() => !state.user.id}
                  path="/signup"
                  redirect="/onboard"
                >
                  <SignUp state={state} dispatch={dispatch} />
                </ProtectedRoute>
                <ProtectedRoute
                  condition={() => !state.user.id}
                  path="/login"
                  redirect="/onboard"
                >
                  <Login state={state} dispatch={dispatch} />
                </ProtectedRoute>
                <ProtectedRoute
                  condition={() =>
                    state.user.id && state.user.languages.length === 0
                  }
                  path="/onboard"
                  redirect={`/profile/${state.user.id}`}
                >
                  <OnBoard state={state} dispatch={dispatch} />
                </ProtectedRoute>

                {/* <Route path="/" exact component={SignUp} /> */}
                <Route exact path="/">
                  <Redirect to={`/profile/${state.user.id}`} />
                </Route>
                <ProtectedRoute
                  condition={() => state.user.id}
                  path="/profile/:userId"
                >
                  <Profile state={state} dispatch={dispatch} />
                </ProtectedRoute>
                <ProtectedRoute condition={() => state.user.id} path="/reviews">
                  <Reviews state={state} dispatch={dispatch} />
                </ProtectedRoute>
                <ProtectedRoute condition={() => state.user.id} path="/balance">
                  <Balance state={state} dispatch={dispatch} />
                </ProtectedRoute>
                <ProtectedRoute
                  condition={() => state.user.id && state.cart?.length}
                  path="/checkout"
                  // creates a failover: first to balance then to login
                  redirect="/balance"
                >
                  <Checkout state={state} dispatch={dispatch} />
                </ProtectedRoute>
              </Switch>
            </BrowserRouter>
          )}
        </MuiThemeProvider>
      </loadingContext.Provider>
    </userContext.Provider>
  );
}

export default App;
