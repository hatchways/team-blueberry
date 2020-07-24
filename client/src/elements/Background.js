import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  gradient: {
    height: '100vh',
    overflowY: 'auto',
    background: theme.palette.background.gradient,
    display: 'flex'
  },
  solid: {
    height: '100vh',
    background: theme.palette.background.solid,
    display: 'flex'
  }
}));

export default function Background(props) {
  const classes = useStyles();
  return <div className={props.gradient ? classes.gradient : classes.solid}>{props.children}</div>;
}
