import React from "react";
import { Route, Redirect } from "react-router-dom";

// Condition should be function that evaluates true when children should be rendered
export const ProtectedRoute = ({ children, condition, ...props }) => {
  return (
    <Route
      {...props}
      render={({ location }) =>
        condition() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
