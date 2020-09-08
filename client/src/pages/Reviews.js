import React, { useState, useEffect, useReducer } from "react";
import Drawer from "@material-ui/core/Drawer";
import Fab from "@material-ui/core/Fab";
import Hidden from "@material-ui/core/Hidden";
import Box from "@material-ui/core/Box";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import Request from "../components/Request";
import Loading from "../elements/Loading";
import Paper from "@material-ui/core/Paper";
import { getReviews } from "../services/reviews";
import { Link } from "react-router-dom";
import dateToYMD from "../utils/dateUtil";

const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexGrow: 1,
  },
  margin: {
    margin: theme.spacing(1),
  },
  fabClose: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  fabOpen: {
    position: "fixed",
    bottom: theme.spacing(2),
    left: theme.spacing(2),
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
    background: theme.palette.background.solid,
  },
  menuButton: {
    marginLeft: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  drawerPaper: {
    width: drawerWidth,
    borderRight: "1px #D3D3D3 solid",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    background: theme.palette.background.solid,
    height: "100vh",
    overflowY: "auto",
  },
  card: {
    minWidth: "100%",
  },
  reviews: {
    margin: theme.spacing(2),
    padding: theme.spacing(2),
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
    margin: theme.spacing(3),
  },
  link: {
    textDecoration: "none",
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

export default function ResponsiveDrawer(props) {
  const { window } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

  const drawer = state.loading ? (
    <Loading />
  ) : (
    <React.Fragment>
      <Box mt={8}>
        <Paper>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab
              label={`Reviews(${state.reviews ? state.reviews.length : 0})`}
            />
            <Tab
              label={`Requests(${state.requests ? state.requests.length : 0})`}
            />
          </Tabs>
        </Paper>
        {renderItems(selectedTab)}
      </Box>
    </React.Fragment>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <nav className={classes.drawer} aria-label="review request tabs">
        <Hidden smUp implementation="css">
          <Fab
            size="medium"
            color="secondary"
            aria-label="add"
            onClick={handleDrawerToggle}
            className={classes.fabOpen}
          >
            <KeyboardArrowRightIcon style={{ fontSize: 30 }} />
          </Fab>
          <Drawer
            container={container}
            variant="persistent"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
            <Fab
              size="medium"
              color="secondary"
              aria-label="add"
              onClick={handleDrawerToggle}
              className={classes.fabClose}
            >
              <KeyboardArrowLeftIcon />
            </Fab>
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <Paper className={classes.reviewPanel}>
          <Request />
        </Paper>
      </main>
    </div>
  );
}
