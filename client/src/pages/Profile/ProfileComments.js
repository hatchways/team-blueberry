import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import AvatarImage from "./img/avatar.png";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Rating from "@material-ui/icons/FiberManualRecord";
import RatingOutlined from "@material-ui/icons/FiberManualRecordOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    // maxWidth: "600px",
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: "inline",
  },
  ratingColor: {
    fill: theme.palette.primary.main,
  },
}));

const ProfileComments = ({ comments }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  return (
    <Paper elevation={1}>
      <List className={classes.root}>
        {comments
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((comment, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <CardHeader
                  avatar={
                    comment.avatar ? (
                      <Avatar src={comment.avatar}></Avatar>
                    ) : (
                      <Avatar src={AvatarImage} />
                    )
                  }
                  title={comment.name}
                  subheader={
                    comment.position ? comment.position : "Not Specififed"
                  }
                />
                <CardContent>
                  {comment.embeddedReview.rating < 2 ? (
                    <React.Fragment>
                      <Rating className={classes.ratingColor} />
                      <RatingOutlined className={classes.ratingColor} />
                      <RatingOutlined className={classes.ratingColor} />
                      <RatingOutlined className={classes.ratingColor} />
                      <RatingOutlined className={classes.ratingColor} />
                    </React.Fragment>
                  ) : comment.embeddedReview.rating < 3 ? (
                    <React.Fragment>
                      <Rating className={classes.ratingColor} />
                      <Rating className={classes.ratingColor} />
                      <RatingOutlined className={classes.ratingColor} />
                      <RatingOutlined className={classes.ratingColor} />
                      <RatingOutlined className={classes.ratingColor} />
                    </React.Fragment>
                  ) : comment.embeddedReview.rating < 4 ? (
                    <React.Fragment>
                      <Rating className={classes.ratingColor} />
                      <Rating className={classes.ratingColor} />
                      <Rating className={classes.ratingColor} />
                      <RatingOutlined className={classes.ratingColor} />
                      <RatingOutlined className={classes.ratingColor} />
                    </React.Fragment>
                  ) : comment.embeddedReview.rating < 5 ? (
                    <React.Fragment>
                      <Rating className={classes.ratingColor} />
                      <Rating className={classes.ratingColor} />
                      <Rating className={classes.ratingColor} />
                      <Rating className={classes.ratingColor} />
                      <RatingOutlined className={classes.ratingColor} />
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Rating className={classes.ratingColor} />
                      <Rating className={classes.ratingColor} />
                      <Rating className={classes.ratingColor} />
                      <Rating className={classes.ratingColor} />
                      <Rating className={classes.ratingColor} />
                    </React.Fragment>
                  )}

                  <Typography className={classes.comment}>
                    {comment.comment ? comment.comment : "Not Specified"}
                  </Typography>
                </CardContent>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        {/* TODO Add pagination here */}
      </List>
    </Paper>
  );
};

export default ProfileComments;
