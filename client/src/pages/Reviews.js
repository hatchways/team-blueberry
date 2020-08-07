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

// const drawerWidth = 360;

const useStyles = makeStyles((theme) => ({
  card: {
    minWidth: "100%",
  },
  reviewWindow: {
    margin: "auto",
  },
  reviewTitles: {
    display: "grid",
    textAlign: "center",
    flexDirection: "row",
  },
  reviews: {
    margin: theme.spacing(2),
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

    if (result.status != 201) {
      return false;
    } else {
      setReviews(result.reviews);
    }
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

  function dateToYMD(date) {
    var strArray = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var d = date.getDate();
    var m = strArray[date.getMonth()];
    var y = date.getFullYear();
    return "" + (d <= 9 ? "" + d : d) + " " + m + " " + y;
  }

  const ReviewCard = (props) => {
    let { path, url } = useRouteMatch();
    return (
      <ListItem
        key={props.reviewId}
        selected={selectedIndex === props.index}
        onClick={(event) => handleListItemClick(event, props.index, props)}
        className={classes.reviews}
      >
        <Card className={classes.card}>
          <CardContent>
            <React.Fragment>
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
                <MoreVertIcon button></MoreVertIcon>
                {props.date}
              </Typography>
            </React.Fragment>
          </CardContent>
        </Card>
      </ListItem>
    );
  };

  let { path, url } = useRouteMatch();
  return (
    <Grid container>
      <Router>
        <Grid item xs={3}>
          <div className={classes.reviewTitles}>
            <Typography color="textPrimary" compoment="h1" variant="h4">
              Reviews
            </Typography>
            <Typography color="textPrimary" compoment="h1" variant="h5">
              ({reviews ? reviews.length : 0})
            </Typography>
          </div>
          <List component="nav">
            {Array.isArray(reviews) ? (
              reviews.map((item, idx) => {
                return (
                  <Link
                    to={`${path}/${item._id}`}
                    key={idx}
                    className={classes.link}
                  >
                    <ReviewCard
                      index={idx}
                      reviewId={item._id}
                      reviewTitle={item.title}
                      date={dateToYMD(new Date(item.reviewCreatedDate))}
                    ></ReviewCard>
                  </Link>
                );
              })
            ) : (
              <ListItem>
                <Button>Refresh</Button>
              </ListItem>
            )}
          </List>
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
      </Router>
    </Grid>
  );
};

export default Reviews;
