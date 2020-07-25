import React from "react";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  alert: {
    padding: 10,
    alignItems: "center",
    background: "#f2dede",
    border: 1,
    borderStyle: "solid",
    borderColor: "#ebccd1",
    borderRadius: "4px",
  },
}));

export default function Alert(props) {
  const classes = useStyles();
  return (
    <Box
      mt={2}
      fontSize="body1.fontSize"
      textAlign="center"
      color="#a94442"
      display={props.display}
      className={classes.alert}
      onClick={props.onClick}
    >
      {props.children}
    </Box>
  );
}
