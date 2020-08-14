import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  useRouteMatch,
} from "react-router-dom";
// Import reviews service
import { getReviews } from "../services/reviews";

//import utilities
import dateToYMD from "../utils/dateUtil";

//Material-ui imports
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

// component imports
import Request from "../components/Request";

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: "100%",
  },
  reviewsHeight: {
    minHeight: "100vh",
  },
  reviewTitles: {
    margin: theme.spacing(4),
  },
  reviewMainTitle: {
    marginRight: theme.spacing(1),
  },
  reviews: {
    margin: theme.spacing(4),
    padding: theme.spacing(4),
    overflow: "auto",
    cursor: "pointer",
  },
  selectedReviewPaper: {
    border: `solid ${theme.palette.primary.main} 1px`,
  },
  reviewPanel: {
    margin: theme.spacing(6),
  },
  link: {
    textDecoration: "none",
  },
  background: {
    backgroundColor: "#ecf0fa",
  },
}));

const Reviews = ({ state, dispatch }) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(false);
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const result = await getReviews(dispatch);
    setReviews(result.reviews);
  };

  const handleListItemClick = (event, index, props) => {
    setSelectedIndex(index);
  };

  const ReviewCard = (props) => {
    return (
      <div
        key={props.reviewId}
        selected={selectedIndex === props.index}
        onClick={(event) => handleListItemClick(event, props.index, props)}
      >
        <Typography
          color="textPrimary"
          gutterBottom
          compoment="h1"
          variant="h6"
        >
          {props.reviewTitle}
        </Typography>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {dateToYMD(props.date)}
        </Typography>
      </div>
    );
  };

  let { path } = useRouteMatch();
  return (
    <Grid container direction="column">
      <Router>
        <Grid item container>
          <Grid item xs={4} className={classes.reviewsHeight}>
            <React.Fragment>
              <div className={classes.reviewTitles}>
                <Typography
                  color="textPrimary"
                  component="h1"
                  variant="h4"
                  display="inline"
                  className={classes.reviewMainTitle}
                >
                  Reviews
                </Typography>
                <Typography
                  component="h1"
                  variant="h5"
                  display="inline"
                  color="secondary"
                >
                  ({reviews ? reviews.length : 0})
                </Typography>
              </div>
              {Array.isArray(reviews)
                ? reviews.map((item, idx) => {
                    return (
                      <Link
                        to={`${path}/${item._id}`}
                        key={idx}
                        className={classes.link}
                      >
                        <Paper
                          variant="outlined"
                          className={
                            selectedIndex == idx
                              ? [
                                  classes.selectedReviewPaper,
                                  classes.reviews,
                                ].join(" ")
                              : classes.reviews
                          }
                          onClick={(event) => handleListItemClick(event, idx)}
                        >
                          <ReviewCard
                            index={idx}
                            reviewId={item._id}
                            reviewTitle={item.title}
                            date={item.reviewCreatedDate}
                          ></ReviewCard>
                        </Paper>
                      </Link>
                    );
                  })
                : "is not a review"}
            </React.Fragment>
          </Grid>
          <Grid item xs={8} className={classes.background}>
            <Paper className={classes.reviewPanel}>
              <Route path={`${path}/:reviewId`}>
                <Request globalDispatch={dispatch} />
              </Route>
            </Paper>
          </Grid>
        </Grid>
      </Router>
    </Grid>
  );
};

export default Reviews;
