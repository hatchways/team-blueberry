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
    // padding: "10px",
    // margin: "20px",
    // border: "1px solid gray",
    // borderRadius: "5px",
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
    default:
      throw new Error("Something went wrong");
  }
};

// review id will be accessed from url params
const Request = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initState);
  const [editorHasContent, setEditorHasContent] = useState(false);
  const { reviewId } = useParams();
  const user = useContext(userContext);
  const [open, setOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (reviewId) {
      handleInitState();
      socket.messages(reviewId); //Subscribe for messages
    }
    // TODO remove request when unmounting
  }, [reviewId]);

  const handleSocketMessage = (message) => {
    // console.log("STATE: ", state);
    const { newMessage, reviewOwner, selectedReviewer } = message;
    dispatch({
      type: "NEW_MESSAGE",
      review: newMessage.embeddedReview,
      selectedReviewer: selectedReviewer,
      reviewOwner: reviewOwner,
      status: newMessage.status,
    });
  };

  useEffect(() => {
    socket.subscribe("messages", handleSocketMessage);
    return () => socket.unsubscribe("messages");
  }, []);

  // set initial state at first render
  const handleInitState = async () => {
    await getReview(reviewId, dispatch);
  };

  // reviewer header
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
      <RatingDialog open={open} handleClose={handleClose} />
      {state.review ? (
        <React.Fragment>
          <CardHeader title={state.review.title} />
          <CardContent className={classes.headerDate}>
            <Typography component="h5">
              {dateToYMD(state.review.reviewCreatedDate)}
            </Typography>
            {/* Only show if user.id is the same as review id */}
            {state.userOwner === user.id ? (
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
                {/* TODO edit readOnly style */}
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
