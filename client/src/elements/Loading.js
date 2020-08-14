import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    position: "fixed",
    top: "50%",
    left: "50%",
  },
}));

export default function SimpleBackdrop() {
  const classes = useStyles();

  return (
    <div className={classes.backdrop} open={true}>
      <CircularProgress />
    </div>
  );
}
