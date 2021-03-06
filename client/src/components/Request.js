import React, { useState, useEffect, useReducer, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { useParams, useHistory } from "react-router-dom";
import { Divider, Typography } from "@material-ui/core";
import ActionButtons from "./AcceptRejectButton";
import Message from "./Message";
import socket from "../services/sockets";
import RatingDialog from "../components/RatingDialog";
import userContext from "../userContext";
import { usersData, guestRequest, demoRequest } from "../guestData";

//import utilities
import dateToYMD from "../utils/dateUtil";

// API call
import { getReview } from "../services/reviews";

// code editor
import PrismEditor from "../components/Editor/DraftEditor";

// element imports
import Loading from "../elements/Loading";

const useStyles = makeStyles((theme) => ({
  request: {
    borderRadius: "0px",
    overflow: "scroll",
  },
  message: {
    overflow: "scroll",
    maxHeight: "15em",
  },
  headerDate: {
    paddingTop: 0,
    display: "flex",
    justifyContent: "space-between",
  },
  header: {
    cursor: "pointer",
  },
}));

const initState = {
  status: "",
  review: null,
  requestId: "",
  selectedReviewer: null,
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return {
        ...state,
        loading: true,
      };
    case "FETCH_REQUEST_SUCCESS":
      return {
        ...state,
        status: action.status,
        review: action.review,
        requestId: action.requestId,
        loading: false,
        selectedReviewer: action.selectedReviewer,
        selectedReviewerId: action.selectedReviewerId,
        userOwner: action.userOwner,
        reviewOwner: action.reviewOwner,
      };
    case "FETCH_REQUEST_ERROR":
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    case "SEND_MESSAGE":
      return {
        ...state,
        loading: true,
      };
    case "SEND_MESSAGE_SUCCESS":
      return {
        ...state,
        loading: false,
        review: action.review,
        requestId: action.requestId,
      };
    case "SEND_MESSAGE_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case "STATUS_SENT":
      return {
        ...state,
        laoding: true,
      };
    case "STATUS_ACCEPTED":
      return {
        ...state,
        status: action.status,
        selectedReviewer: action.selectedReviewer,
      };
    case "STATUS_DECLINED":
      return {
        ...state,
        status: action.status,
        selectedReviewerId: action.selectedReviewerId,
      };
    case "STATUS_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    case "RESET_CHANGED_STATUS":
      return {
        ...state,
        requestId: action.requestId,
      };
    case "NEW_MESSAGE":
      return {
        ...state,
        review: action.review,
        selectedReviewer: action.selectedReviewer,
        reviewOwner: action.reviewOwner,
        status: action.status,
      };
    case "COMPLETE_REVIEW":
      return {
        ...state,
        loading: true,
      };
    case "COMPLETE_REVIEW_SUCCESS":
      return {
        ...state,
        loading: false,
        status: action.status,
      };
    case "COMPLETE_REVIEW_ERROR":
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      throw new Error("Something went wrong");
  }
};

const Request = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initState);
  const [, setEditorHasContent] = useState(false);
  const { reviewId } = useParams();
  const user = useContext(userContext);
  const [open, setOpen] = useState(false);
  const history = useHistory();
  useEffect(() => {
    if (reviewId && reviewId !== "guestreview" && reviewId !== "demoreview") {
      const handleInitState = async () => {
        await getReview(reviewId, dispatch);
      };
      handleInitState();
      socket.messages(reviewId);
    } else if (reviewId === "guestreview") {
      dispatch({
        type: "FETCH_REQUEST_SUCCESS",
        status: guestRequest.status,
        review: guestRequest.embeddedReview,
        requestId: guestRequest._id,
        selectedReviewer: { ...usersData.demo, _id: usersData.demo.id },
        selectedReviewerId: guestRequest.selectedReviewer,
        userOwner: guestRequest.userOwner,
        reviewOwner: { ...usersData.guest, _id: usersData.guest.id },
      });
    } else if (reviewId === "demoreview") {
      dispatch({
        type: "FETCH_REQUEST_SUCCESS",
        status: demoRequest.status,
        review: demoRequest.embeddedReview,
        requestId: demoRequest._id,
        selectedReviewer: { ...usersData.guest, _id: usersData.guest.id },
        selectedReviewerId: demoRequest.selectedReviewer,
        userOwner: demoRequest.userOwner,
        reviewOwner: { ...usersData.demo, _id: usersData.demo.id },
      });
    }
    // TODO remove request when unmounting
  }, [reviewId]);

  useEffect(() => {
    if (reviewId && reviewId !== "guestreview" && reviewId !== "demoreview") {
      const handleSocketMessage = (message) => {
        const { newMessage, reviewOwner, selectedReviewer } = message;
        if (newMessage.embeddedReview._id === reviewId) {
          dispatch({
            type: "NEW_MESSAGE",
            review: newMessage.embeddedReview,
            selectedReviewer: selectedReviewer,
            reviewOwner: reviewOwner,
            status: newMessage.status,
          });
        }
      };
      socket.subscribe("messages", handleSocketMessage);
      return () => socket.unsubscribe("messages");
    }
  }, [reviewId]);

  const ReviewerHeader = ({
    index,
    selectedReviewer,
    messageOwner,
    reviewOwner,
  }) => {
    const handleProfile = () => {
      if (messageOwner === reviewOwner._id)
        history.push(`/profile/${reviewOwner._id}`);
      else history.push(`/profile/${selectedReviewer._id}`);
    };

    if (index) {
      const avatarImage =
        messageOwner === reviewOwner._id && reviewOwner.avatar
          ? reviewOwner.avatar
          : messageOwner === reviewOwner._id
          ? reviewOwner.name[0]
          : selectedReviewer.avatar
          ? selectedReviewer.avatar
          : selectedReviewer.name[0];
      return (
        <CardHeader
          avatar={
            avatarImage.length === 1 ? (
              <Avatar>{avatarImage}</Avatar>
            ) : (
              <Avatar src={avatarImage} />
            )
          }
          title={
            messageOwner === reviewOwner._id
              ? reviewOwner.name
              : selectedReviewer.name
          }
          subheader={
            messageOwner === reviewOwner._id && reviewOwner.position
              ? reviewOwner.position
              : messageOwner === reviewOwner._id
              ? `Not specified`
              : selectedReviewer.position
              ? selectedReviewer.position
              : `Not specified`
          }
          onClick={handleProfile}
          className={classes.header}
        />
      );
    } else return <></>;
  };

  const handleHasContent = (value) => {
    setEditorHasContent(value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
  };
  return state.loading ? (
    <Loading />
  ) : (
    <div className={classes.request}>
      <RatingDialog
        open={open}
        handleClose={handleClose}
        reviewId={reviewId}
        dispatch={dispatch}
      />
      {state.review ? (
        <React.Fragment>
          <CardHeader title={state.review.title} />
          <CardContent className={classes.headerDate}>
            <Typography component="h5">
              {dateToYMD(state.review.reviewCreatedDate)}
            </Typography>
            {state.userOwner === user.id && state.status === "accepted" ? (
              <Button
                size="small"
                color="secondary"
                variant="contained"
                onClick={handleOpen}
              >
                Complete Review
              </Button>
            ) : null}
          </CardContent>
          <Divider light />
          {state.review.messages.map((item, index) => (
            <React.Fragment key={item._id}>
              <ReviewerHeader
                index={index}
                messageOwner={item.messagePostedBy}
                selectedReviewer={
                  state.selectedReviewer ? state.selectedReviewer : null
                }
                reviewOwner={state.reviewOwner}
              />
              <CardContent className={classes.message}>
                <PrismEditor
                  language={state.review.language}
                  hasContent={handleHasContent}
                  readOnly
                  content={JSON.parse(item.message)}
                ></PrismEditor>
              </CardContent>
            </React.Fragment>
          ))}
          <Message
            reviewId={reviewId}
            dispatch={dispatch}
            status={state.status}
            language={state.review.language}
            userOwner={state.userOwner}
            selectedReviewer={state.selectedReviewerId}
          />
          <ActionButtons
            status={state.status}
            dispatch={dispatch}
            requestId={state.requestId}
            selectedReviewer={state.selectedReviewerId}
          />
        </React.Fragment>
      ) : (
        state.error
      )}
    </div>
  );
};

export default Request;
