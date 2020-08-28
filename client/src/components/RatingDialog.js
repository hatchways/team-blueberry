import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import PageHeader from "../elements/PageHeader";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import RatingCircle from "@material-ui/icons/RadioButtonUncheckedOutlined";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { completeReview } from "../services/reviews";

const useStyles = makeStyles((theme) => ({
  submit: {
    marginTop: theme.spacing(2),
  },
  ratings: {
    marginBottom: theme.spacing(2),
  },
  icon: {
    color: theme.palette.primary.main,
    borderRadius: "50%",
    cursor: "pointer",
    marginRight: theme.spacing(1),
    maxHeight: "27px",
    maxWidth: "27px",
  },
  text: {
    marginBottom: theme.spacing(2),
  },
  textHeight: {
    minHeight: "27px",
  },
}));

const RatingDialog = ({ open, handleClose, reviewId, dispatch }) => {
  const classes = useStyles();
  const icon = {
    color: "#43DDC1",
    borderRadius: "50%",
    cursor: "pointer",
  };
  const iconHovered = {
    background: "#43DDC1",
  };
  const [rating1, setRating1] = useState(icon);
  const [rating2, setRating2] = useState(icon);
  const [rating3, setRating3] = useState(icon);
  const [rating4, setRating4] = useState(icon);
  const [rating5, setRating5] = useState(icon);
  const [hoverText, setHoverText] = useState("");
  const [clickedText, setClickedText] = useState("");
  const [clicked, setClicked] = useState(false);
  const [rating, setRating] = useState(1);

  // hover, click set to false
  const handleHoverEnter = (num) => {
    if (clicked) {
      setClicked(false);
      setRating1(icon);
      setRating2(icon);
      setRating3(icon);
      setRating4(icon);
      setRating5(icon);
      setClickedText("");
      setHoverText("");
    }
    if (num === 1) {
      setRating1(iconHovered);
      setHoverText("Useless :(");
    } else if (num === 2) {
      setRating1(iconHovered);
      setRating2(iconHovered);
      setHoverText("Could be better");
    } else if (num === 3) {
      setRating1(iconHovered);
      setRating2(iconHovered);
      setRating3(iconHovered);
      setHoverText("That's ok");
    } else if (num === 4) {
      setRating1(iconHovered);
      setRating2(iconHovered);
      setRating3(iconHovered);
      setRating4(iconHovered);
      setHoverText("Great Review!");
    } else {
      setRating1(iconHovered);
      setRating2(iconHovered);
      setRating3(iconHovered);
      setRating4(iconHovered);
      setRating5(iconHovered);
      setHoverText("Outstanding!!! :)");
    }
  };

  const handleHoverLeave = (num) => {
    if (num === 1 && !clicked) {
      setRating1(icon);
      setHoverText("");
    } else if (num === 2 && !clicked) {
      setRating1(icon);
      setRating2(icon);
      setHoverText("");
    } else if (num === 3 && !clicked) {
      setRating1(icon);
      setRating2(icon);
      setRating3(icon);
      setHoverText("");
    } else if (num === 4 && !clicked) {
      setRating1(icon);
      setRating2(icon);
      setRating3(icon);
      setRating4(icon);
      setHoverText("");
    } else if (num === 5 && !clicked) {
      setRating1(icon);
      setRating2(icon);
      setRating3(icon);
      setRating4(icon);
      setRating5(icon);
      setHoverText("");
    }
  };

  // click, set to true
  const handleClicked = (num) => {
    setClicked(true);
    if (num === 1) {
      setRating1(iconHovered);
      setClickedText("Useless :(");
    } else if (num === 2) {
      setRating1(iconHovered);
      setRating2(iconHovered);
      setClickedText("Could be better");
    } else if (num === 3) {
      setRating1(iconHovered);
      setRating2(iconHovered);
      setRating3(iconHovered);
      setClickedText("That's ok");
    } else if (num === 4) {
      setRating1(iconHovered);
      setRating2(iconHovered);
      setRating3(iconHovered);
      setRating4(iconHovered);
      setClickedText("Great Review!");
    } else {
      setRating1(iconHovered);
      setRating2(iconHovered);
      setRating3(iconHovered);
      setRating4(iconHovered);
      setRating5(iconHovered);
      setClickedText("Outstanding!!! :)");
    }
    setRating(num);
  };

  const handleSubmit = async () => {
    await completeReview(reviewId, rating, dispatch);
    // TODO need sockets to do realtime update when review is completed
    handleClose();
  };

  return (
    <Dialog fullWidth maxWidth="md" onClose={handleClose} open={open}>
      <DialogContent>
        <PageHeader>Rate this review</PageHeader>
        <Box mt={3} mb={5} pl={5} pr={5}>
          <Grid container>
            <Grid
              item
              xs={12}
              container
              justify="center"
              className={classes.ratings}
            >
              <RatingCircle
                className={classes.icon}
                fontSize="large"
                onMouseEnter={() => handleHoverEnter(1)}
                onMouseLeave={() => handleHoverLeave(1)}
                onClick={() => handleClicked(1)}
                style={rating1}
              />
              <RatingCircle
                className={classes.icon}
                fontSize="large"
                onMouseEnter={() => handleHoverEnter(2)}
                onMouseLeave={() => handleHoverLeave(2)}
                onClick={() => handleClicked(2)}
                style={rating2}
              />
              <RatingCircle
                className={classes.icon}
                fontSize="large"
                onMouseEnter={() => handleHoverEnter(3)}
                onMouseLeave={() => handleHoverLeave(3)}
                onClick={() => handleClicked(3)}
                style={rating3}
              />
              <RatingCircle
                className={classes.icon}
                fontSize="large"
                onMouseEnter={() => handleHoverEnter(4)}
                onMouseLeave={() => handleHoverLeave(4)}
                onClick={() => handleClicked(4)}
                style={rating4}
              />
              <RatingCircle
                className={classes.icon}
                fontSize="large"
                onMouseEnter={() => handleHoverEnter(5)}
                onMouseLeave={() => handleHoverLeave(5)}
                onClick={() => handleClicked(5)}
                style={rating5}
              />
            </Grid>
            <Grid
              item
              xs={12}
              container
              justify="center"
              className={classes.text}
            >
              <Typography
                component="h5"
                variant="h5"
                className={classes.textHeight}
              >
                {clicked ? clickedText : hoverText}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                fullWidth
                rows={6}
                placeholder="Write your comment here..."
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} container justify="center">
              <Button
                color="primary"
                variant="contained"
                className={classes.submit}
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;
