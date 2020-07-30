import React, { useReducer, useEffect } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import reducer from "./reducers";
import initState from "./initState";
import userContext from "./userContext";
import { theme } from "./themes/theme";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
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
    return () => dispatch("FINISH_LOAD");
  }, [dispatch]);
  console.log((() => !state?.user?.id)());

  return (
    <userContext.Provider value={state.user}>
      <MuiThemeProvider theme={theme}>
        <BrowserRouter>
          {/* This is ugly, but not sure how we want to handle index */}
          {state.user.id && window.location.pathname !== "/" ? (
            <Navbar state={state} dispatch={dispatch} />
          ) : (
            <> </>
          )}
          <Switch>
            <ProtectedRoute
              condition={() => !state.user.id}
              path="/signup"
              redirect="/profile"
            >
              <SignUp />
            </ProtectedRoute>
            <ProtectedRoute
              condition={() => !state.user.id}
              path="/login"
              redirect="/profile"
            >
              <Login />
            </ProtectedRoute>
            <ProtectedRoute condition={() => state.user.id} path="/onboard">
              <OnBoard state={state} dispatch={dispatch} />
            </ProtectedRoute>
            <Route path="/" exact component={SignUp} />
            <ProtectedRoute condition={() => state.user.id} path="/profile">
              <Profile state={state} dispatch={dispatch} />
            </ProtectedRoute>
            <ProtectedRoute condition={() => state.user.id} path="/reviews">
              <Reviews state={state} dispatch={dispatch} />
            </ProtectedRoute>
            <ProtectedRoute condition={() => state.user.id} path="/balance">
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
