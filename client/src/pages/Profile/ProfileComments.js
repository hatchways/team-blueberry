import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import AvatarImage from "./img/avatar.png";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Rating from "@material-ui/icons/FiberManualRecord";
import RatingOutlined from "@material-ui/icons/FiberManualRecordOutlined";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackward from "@material-ui/icons/ArrowBackIosOutlined";
import ArrowForward from "@material-ui/icons/ArrowForwardIosOutlined";
import PageHeader from "../../elements/PageHeader";
import FormatQuoteRoundedIcon from "@material-ui/icons/FormatQuoteRounded";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  ratingColor: {
    fill: theme.palette.primary.main,
  },
  cardHeader: {
    minWidth: "260px",
  },
  comment: {
    fontStyle: "italic",
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    margin: "0 auto",
  },
  mobileSpacing: {
    marginTop: theme.spacing(1),
  },
}));

const ProfileComments = ({ comments }) => {
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  // Get current posts
  const commentsPerPage = 3;
  const indexOfLastPost = currentPage * commentsPerPage;
  const indexOfFirstPost = indexOfLastPost - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  const CommentsRatings = ({ rating }) => {
    if (rating === 1) {
      return (
        <React.Fragment>
          <Rating className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
        </React.Fragment>
      );
    } else if (rating === 2) {
      return (
        <React.Fragment>
          <Rating className={classes.ratingColor} />
          <Rating className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
        </React.Fragment>
      );
    } else if (rating === 3) {
      return (
        <React.Fragment>
          <Rating className={classes.ratingColor} />
          <Rating className={classes.ratingColor} />
          <Rating className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
          <RatingOutlined className={classes.ratingColor} />
        </React.Fragment>
      );
    } else if (rating === 4) {
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
      if (currentPage === 1) {
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
    <>
      <PageHeader>Comments</PageHeader>
      <List className={classes.root}>
        {currentComments.map((comment, index) => (
          <React.Fragment key={index}>
            {isMobile ? (
              <Box mt={4} mb={4}>
                <Avatar
                  src={comment.avatar ? comment.avatar : AvatarImage}
                  className={classes.large}
                />
                <Typography
                  variant="subtitle1"
                  className={classes.mobileSpacing}
                >
                  {comment.name}
                </Typography>
                <Typography variant="subtitle2">{comment.position}</Typography>
                <CommentsRatings rating={comment.embeddedReview.rating} />
                <Box>
                  <FormatQuoteRoundedIcon color="disabled" />
                </Box>
                <Box fontSize={16} className={classes.comment}>
                  {comment.comment}
                </Box>
              </Box>
            ) : (
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
                  subheader={comment.position ? comment.position : null}
                  className={classes.cardHeader}
                />
                <CardContent>
                  <CommentsRatings rating={comment.embeddedReview.rating} />
                  {comment.comment && (
                    <Typography className={classes.comment} variant="subtitle1">
                      <Box fontSize={16} ml={1}>
                        <Grid
                          item
                          container
                          direction="row"
                          xs={12}
                          spacing={2}
                        >
                          <Grid item xs={1}>
                            <FormatQuoteRoundedIcon color="disabled" />
                          </Grid>
                          <Grid item xs={11}>
                            {comment.comment}
                          </Grid>
                        </Grid>
                      </Box>
                    </Typography>
                  )}
                </CardContent>
              </ListItem>
            )}
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
    </>
  );
};

export default ProfileComments;
