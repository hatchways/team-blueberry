import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1, 6),
    border: 0,
    borderRadius: 25,
    color: "#fff",
    textTransform: "none",
    fontSize: 15,
  },
}));

export default function SubmitButton(props) {
  const classes = useStyles();

  return (
    <Button
      size="large"
      type="submit"
      variant="contained"
      color="primary"
      className={classes.submit}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
}
