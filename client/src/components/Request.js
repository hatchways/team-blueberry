import React, { useState, useEffect, useReducer, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import { useParams } from "react-router-dom";
import { Divider } from "@material-ui/core";
import userContext from "../userContext";
import ActionButtons from "./AcceptRejectButton";
import Message from "./Message";

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
      };
    case "FETCH_REQUEST_ERROR":
      return {
        ...state,
        error: action.error,
        loading: true,
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
    case "STATUS_ACCEPTED":
      return {
        ...state,
        status: action.status,
      };
    case "STATUS_DECLINED":
      return {
        ...state,
        status: action.status,
        review: action.review,
      };
    case "RESET_CHANGED_STATUS":
      return {
        ...state,
        requestId: action.requestId,
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

  useEffect(() => {
    handleInitState();
    // TODO remove request when unmounting
  }, [reviewId]);

  // set initial state at first render
  const handleInitState = async () => {
    await getReview(reviewId, dispatch);
  };

  // reviewer header
  const ReviewerHeader = ({ index }) => {
    const user = useContext(userContext);
    if (index) {
      return (
        <CardHeader
          avatar={<Avatar>{user.name[0]}</Avatar>}
          title={user.name}
          subheader={user.job || `${user.name}'s Job`}
        />
      );
    } else return <></>;
  };

  const handleHasContent = (value) => {
    setEditorHasContent(value);
  };
  return state.loading ? (
    <Loading />
  ) : (
    <div className={classes.request}>
      {state.review ? (
        <React.Fragment>
          <CardHeader title={state.review.title} />
          <Divider />
          {state.review.messages.map((item, index) => (
            <React.Fragment key={item._id}>
              <ReviewerHeader index={index} />
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
          />
          <ActionButtons
            status={state.status}
            dispatch={dispatch}
            requestId={state.requestId}
            selectedReviewer={state.selectedReviewer}
          />
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default Request;
