import React from "react";
// Import reviews service
import { getReviews } from "../services/reviews";

//Material-ui imports
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Navbar from "../components/Navbar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Background from "../elements/Background";
import IconButton from "@material-ui/core/IconButton";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import SubmitButton from "../elements/SubmitButton";
import StyledPaper from "../elements/StyledPaper";
import PageHeader from "../elements/PageHeader";
import Drawer from "@material-ui/core/Drawer";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { theme } from "../themes/theme";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import { CardActionArea, AppBar, Paper } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";

// const drawerWidth = 360;

const useStyles = makeStyles((theme) => ({
  root: {
    // display: "flex",
  },
  //Need to implement code to allow for responsive change to drawer instead of peristent list
  drawer: {
    // width: "100%",
    // flexShrink: 0,
  },
  drawerPaper: {
    // width: "100%",
  },
  drawerContainer: {
    // overflow: "auto",
  },
  content: {
    // flexGrow: 1,
    // padding: theme.spacing(3),
  },
  card: {
    minWidth: "100%",
    // padding: "5% 5%",
  },
  reviewWindow: {
    margin: "auto",
  },
}));

const Reviews = ({ state, dispatch }) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(false);

  const loadReview = (review) => {
    try {
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleListItemClick = (event, index, props) => {
    setSelectedIndex(index);
    loadReview(props.reviewId);
  };

  const ReviewCard = (props) => {
    return (
      <ListItem
        key={props.reviewId}
        button
        selected={selectedIndex === props.index}
        onClick={(event) => handleListItemClick(event, props.index, props)}
      >
        <Card className={classes.card}>
          <CardActionArea>
            <CardContent>
              <Grid container direction="row">
                <Typography
                  className={classes.title}
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
                  // compoment={h1}
                >
                  <MoreVertIcon />
                  {props.date}
                </Typography>
              </Grid>
            </CardContent>
          </CardActionArea>
        </Card>
      </ListItem>
    );
  };

  return (
    <Background gradient>
      <Grid container component="main" direction="column">
        <CssBaseline />
        <Grid item xs={12}>
          {/* <AppBar>Test</AppBar> */}
          {/* <Navbar state={state} dispatch={dispatch} /> */}
        </Grid>
        <Grid item container direction="row">
          <Grid item container direction="column" xs={4}>
            <Background solid>
              <Typography
                className={classes.title}
                color="textPrimary"
                compoment="h1"
                variant="h2"
              >
                Reviews
              </Typography>
              <List component="nav">
                <ReviewCard
                  reviewId="0"
                  reviewTitle="Animation"
                  date="10 Jan 2020"
                ></ReviewCard>
              </List>
            </Background>
          </Grid>
          <Grid item container direction="column" xs={8}>
            <Card className={classes.reviewWindow}>
              <CardContent>Testing</CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Background>
  );
};

export default Reviews;
