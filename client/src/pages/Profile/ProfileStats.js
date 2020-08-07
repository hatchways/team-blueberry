import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  number: {
    color: "#6E3ADB",
  },
}));

export default function ProfileStats({ years, reviews, rating }) {
  const classes = useStyles();

  return (
    <Grid item container direction="row" justify="space-evenly" spacing={5}>
      <Grid item>
        <Box
          fontSize="h2.fontSize"
          textAlign="center"
          className={classes.number}
        >
          {years}
        </Box>
        <Box
          fontSize="h6.fontSize"
          textAlign="center"
          fontWeight="fontWeightBold"
        >
          years of experience
        </Box>
      </Grid>
      <Grid item>
        <Box
          fontSize="h2.fontSize"
          textAlign="center"
          className={classes.number}
        >
          {reviews}
        </Box>
        <Box
          fontSize="h6.fontSize"
          textAlign="center"
          fontWeight="fontWeightBold"
        >
          reviews
        </Box>
      </Grid>
      <Grid item>
        <Box
          fontSize="h2.fontSize"
          textAlign="center"
          className={classes.number}
        >
          {rating}
        </Box>
        <Box
          fontSize="h6.fontSize"
          textAlign="center"
          fontWeight="fontWeightBold"
        >
          rating
        </Box>
      </Grid>
    </Grid>
  );
}
