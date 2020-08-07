import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
  Link,
  useRouteMatch,
} from "react-router-dom";
// Import reviews service
import { getReviews, getReview } from "../services/reviews";

//import utilities
import dateToYMD from "../utils/dateUtil";

//Material-ui imports
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Background from "../elements/Background";
import StyledPaper from "../elements/StyledPaper";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { theme } from "../themes/theme";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import { CardActionArea, Paper, Divider, TextField } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: "100%",
  },
  reviewsHeight: {
    minHeight: "100vh",
  },
  reviewTitles: {
    display: "flex",
    justifyContent: "center",
  },
  reviews: {
    margin: theme.spacing(3),
    padding: theme.spacing(2),
    overflow: "auto",
    cursor: "pointer",
  },
  selectedReviewPaper: {
    border: `solid ${theme.palette.primary.main} 1px`,
  },
  reviewPanel: {
    margin: theme.spacing(6),
    textAlign: "center",
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
  const [selectedIndex, setSelectedIndex] = React.useState(false);
  const [reviews, setReviews] = React.useState(false);

  const fetchData = async () => {
    const result = await getReviews(dispatch);
    setReviews(result.reviews);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ReviewPanel = (props) => {
    const [fetchedReview, setFetchedReview] = React.useState();
    let { reviewId } = useParams();
    const loadReview = async (reviewId) => {
      try {
        const result = await getReview(reviewId, dispatch);

        if (result.status != 201) {
          return false;
        } else {
          setFetchedReview(() => result);
        }
      } catch (error) {
        console.error(error.message);
      }
    };

    useEffect(() => {
      loadReview(reviewId);
    }, []);

    return fetchedReview ? (
      <Grid item classNames={classes.reviewPanelContent}>
        <Typography component="h1" variant="h3">
          {fetchedReview.review.title}
        </Typography>
        <Divider />
        <Button>Submit</Button>
        <Typography color="textSecondary" gutterBottom>
          {dateToYMD(new Date(fetchedReview.review.reviewCreatedDate))}
        </Typography>
        <TextField></TextField>
      </Grid>
    ) : (
      <Typography component="h1" variant="h3">
        Invalid Review
      </Typography>
    );
  };

  const handleListItemClick = (event, index, props) => {
    setSelectedIndex(index);
  };

  const ReviewCard = (props) => {
    let { path, url } = useRouteMatch();
    return (
      <React.Fragment
        key={props.reviewId}
        selected={selectedIndex === props.index}
        onClick={(event) => handleListItemClick(event, props.index, props)}
        className={classes.reviews}
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
      </React.Fragment>
    );
  };

  let { path, url } = useRouteMatch();
  return (
    <Grid container direction="column">
      <Router>
        <Grid item container>
          <Grid item xs={3} className={classes.reviewsHeight}>
            <div className={classes.reviewTitles}>
              <Typography color="textPrimary" compoment="h1" variant="h3">
                Reviews
              </Typography>
              <Typography
                color="textPrimary"
                compoment="h1"
                variant="h4"
                color="secondary"
              >
                ({reviews ? reviews.length : 0})
              </Typography>
            </div>
            <div>
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
            </div>
          </Grid>
          <Grid item xs={9} className={classes.background}>
            <Paper className={classes.reviewPanel}>
              <Switch>
                <Route exact path={path}>
                  <Typography component="h1" variant="h4">
                    Select a Review
                  </Typography>
                </Route>
                <Route path={`${path}/:reviewId`}>
                  <ReviewPanel></ReviewPanel>
                </Route>
              </Switch>
            </Paper>
          </Grid>
        </Grid>
      </Router>
    </Grid>
  );
};

export default Reviews;
