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
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackward from "@material-ui/icons/ArrowBackIosOutlined";
import ArrowForward from "@material-ui/icons/ArrowForwardIosOutlined";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    width: "100%",
  },
  inline: {
    display: "inline",
  },
  ratingColor: {
    fill: theme.palette.primary.main,
  },
  cardHeader: {
    minWidth: "260px",
  },
}));

const ProfileComments = ({ comments }) => {
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useState(1);

  // Get current posts
  const commentsPerPage = 3;
  const indexOfLastPost = currentPage * commentsPerPage;
  const indexOfFirstPost = indexOfLastPost - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const CommentsRatings = ({ rating }) => {
    if (rating < 2) {
      return (
        <React.Fragment>
          <Rating className={classes.ratingColor} />
          <Rating className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
        </React.Fragment>
      );
    } else if (rating < 3) {
      return (
        <React.Fragment>
          <Rating className={classes.ratingColor} />
          <Rating className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
        </React.Fragment>
      );
    } else if (rating < 4) {
      return (
        <React.Fragment>
          <Rating className={classes.ratingColor} />
          <Rating className={classes.ratingColor} />
          <Rating className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
        </React.Fragment>
      );
    } else if (rating < 5) {
      return (
        <React.Fragment>
          <Rating className={classes.ratingColor} />
          <Rating className={classes.ratingColor} />
          <Rating className={classes.ratingColor} />
          <Rating className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Rating className={classes.ratingColor} />
          <Rating className={classes.ratingColor} />
          <Rating className={classes.ratingColor} />
          <Rating className={classes.ratingColor} />
          <Rating className={classes.ratingColor} />
        </React.Fragment>
      );
    }
  };

  const Pagination = ({ totalPages, currentPage, handlePage }) => {
    if (totalPages >= 3) {
      if (currentPage == 1) {
        return (
          <React.Fragment>
            <IconButton disabled={true}>{currentPage}</IconButton>
            <IconButton onClick={() => handlePage(currentPage + 1)}>
              {currentPage + 1}
            </IconButton>
            <IconButton onClick={() => handlePage(currentPage + 2)}>
              {currentPage + 2}
            </IconButton>
          </React.Fragment>
        );
      } else if (currentPage === totalPages) {
        return (
          <React.Fragment>
            <IconButton onClick={() => handlePage(currentPage - 2)}>
              {currentPage - 2}
            </IconButton>
            <IconButton onClick={() => handlePage(currentPage - 1)}>
              {currentPage - 1}
            </IconButton>
            <IconButton disabled={true}>{currentPage}</IconButton>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <IconButton onClick={() => handlePage(currentPage - 1)}>
              {currentPage - 1}
            </IconButton>
            <IconButton disabled={true}>{currentPage}</IconButton>
            <IconButton onClick={() => handlePage(currentPage + 1)}>
              {currentPage + 1}
            </IconButton>
          </React.Fragment>
        );
      }
    } else if (totalPages === 2) {
      if (currentPage === 1) {
        return (
          <React.Fragment>
            <IconButton disabled={true}>{currentPage}</IconButton>
            <IconButton onClick={() => handlePage(currentPage + 1)}>
              {currentPage + 1}
            </IconButton>
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <IconButton onClick={() => handlePage(currentPage - 1)}>
              {currentPage - 1}
            </IconButton>
            <IconButton disabled={true}>{currentPage}</IconButton>
          </React.Fragment>
        );
      }
    } else {
      return <IconButton disabled={true}>{currentPage}</IconButton>;
    }
  };

  const handleBack = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleForward = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <Paper elevation={1} className={classes.paper}>
      <List className={classes.root}>
        {currentComments.map((comment, index) => (
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
                className={classes.cardHeader}
              />
              <CardContent>
                <CommentsRatings rating={comment.embeddedReview.rating} />
                <Typography className={classes.comment}>
                  {comment.comment ? comment.comment : "Not Specified"}
                </Typography>
              </CardContent>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
        {comments.length ? (
          <Box>
            <IconButton disabled={currentPage === 1} onClick={handleBack}>
              <ArrowBackward />
            </IconButton>
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              handlePage={handlePage}
            />
            <IconButton
              disabled={currentPage === totalPages}
              onClick={handleForward}
            >
              <ArrowForward />
            </IconButton>
          </Box>
        ) : null}
      </List>
    </Paper>
  );
};

export default ProfileComments;
