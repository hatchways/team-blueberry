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
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

// component imports
import Request from "../components/Request";

// element imports
import Loading from "../elements/Loading";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
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
        requests: action.requests,
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
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    fetchData();
    // TODO remove reviews when unmounting
  }, []);
  const fetchData = async () => {
    await getReviews(dispatch);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const updatedTab = { ...selectedTab };

    if (newValue === 0) {
      updatedTab.reviews = true;
      updatedTab.requests = false;
    } else {
      updatedTab.reviews = false;
      updatedTab.requests = true;
    }
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
          <Link to={`/reviews/${item._id}`} key={idx} className={classes.link}>
            <Paper
              variant="outlined"
              className={
                selectedIndex === idx
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
              <Paper className={classes.root}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="primary"
                  textColor="primary"
                  centered
                >
                  <Tab
                    label={`Reviews(${
                      state.reviews ? state.reviews.length : 0
                    })`}
                  />
                  <Tab
                    label={`Requests(${
                      state.requests ? state.requests.length : 0
                    })`}
                  />
                </Tabs>
              </Paper>
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
