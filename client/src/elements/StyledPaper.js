import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(6),
    padding: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function StyledPaper(props) {
  const classes = useStyles();

  return (
    <Paper elevation={3} className={classes.paper}>
      {props.children}
    </Paper>
  );
}
