import React, { useState } from "react";
//Material-ui imports
import { makeStyles } from "@material-ui/core/styles";
import Background from "../elements/Background";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
    textAlign: "center",
  },
  root: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export default function Login(props) {
  const classes = useStyles();

  return (
    <Background solid>
      <div className={classes.root}>
        <Box display="flex" p={1}>
          <CircularProgress color="primary" />
        </Box>
      </div>
    </Background>
  );
}
