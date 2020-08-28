import React, { useEffect, useState, useReducer } from "react";
import { Link } from "react-router-dom";
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

// element imports
import Loading from "../elements/Loading";

const useStyles = makeStyles((theme) => ({
  // do we need this?
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
  selectedTab: {
    backgroundColor: "gray",
    padding: theme.spacing(6),
  },
  unselectedTab: {
    padding: theme.spacing(6),
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

const initState = {
  reviews: [],
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REVIEWS":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_REVIEWS_SUCCESS":
      return {
        ...state,
        loading: false,
        reviews: action.reviews,
      };
    case "FETCH_REVIEWS_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      throw new Error("Something went wrong");
  }
};

const Reviews = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initState);
  const [selectedIndex, setSelectedIndex] = useState(false);
  const [selectedTab, setSelectedTab] = useState({
    reviews: true,
    requests: false,
  });

  useEffect(() => {
    fetchData();
    // TODO remove reviews when unmounting
  }, []);
  const fetchData = async () => {
    await getReviews(dispatch);

    //Need to implement getRequests similar to getReviews()
    // await getRequests(dispatch);
  };

  const handleTabItemClick = (event, item) => {
    const updatedTab = { ...selectedTab };

    updatedTab.reviews = !updatedTab.reviews;
    updatedTab.requests = !updatedTab.requests;

    setSelectedTab(updatedTab);
  };

  const handleListItemClick = (event, index, props) => {
    setSelectedIndex(index);
  };

  const renderItems = (target) => {
    const tabName = target.reviews ? "reviews" : "requests";
    if (Array.isArray(state[tabName])) {
      return state[tabName].map((item, idx) => {
        return (
          <Link
            to={`/${tabName}/${item._id}`}
            key={idx}
            className={classes.link}
          >
            <Paper
              variant="outlined"
              className={
                selectedIndex == idx
                  ? [classes.selectedReviewPaper, classes.reviews].join(" ")
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
      });
    } else {
      return state.error;
    }
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

  return (
    <Grid container direction="column">
      <Grid item container>
        <Grid item xs={4} className={classes.reviewsHeight}>
          {state.loading ? (
            <Loading />
          ) : (
            <React.Fragment>
              <div
                className={classes.reviewTitles}
                style={{
                  display: "flex",
                }}
              >
                <div
                  className={
                    selectedTab.reviews
                      ? classes.selectedTab
                      : classes.unselectedTab
                  }
                  onClick={(event) =>
                    !selectedTab.reviews
                      ? handleTabItemClick(event, "reviews")
                      : ""
                  }
                >
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
                    ({state.reviews ? state.reviews.length : 0})
                  </Typography>
                </div>
                <div
                  className={
                    selectedTab.requests
                      ? classes.selectedTab
                      : classes.unselectedTab
                  }
                  onClick={(event) =>
                    !selectedTab.requests
                      ? handleTabItemClick(event, "requests")
                      : ""
                  }
                >
                  <Typography
                    color="textPrimary"
                    component="h1"
                    variant="h4"
                    display="inline"
                    className={classes.reviewMainTitle}
                  >
                    Requests
                  </Typography>

                  <Typography
                    component="h1"
                    variant="h5"
                    display="inline"
                    color="secondary"
                  >
                    {/* Change this to be requests.length */}(
                    {state.reviews ? state.reviews.length : 0})
                  </Typography>
                </div>
              </div>
              {renderItems(selectedTab)}
            </React.Fragment>
          )}
        </Grid>
        <Grid item xs={8} className={classes.background}>
          <Paper className={classes.reviewPanel}>
            <Request />
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Reviews;
