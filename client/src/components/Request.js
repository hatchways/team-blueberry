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
  statusChanged: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return {
        ...state,
        status: action.status,
        review: action.review,
        requestId: action.requestId,
      };
    case "STATUS_ACCEPTED":
      return {
        ...state,
        status: action.status,
        statusChanged: action.statusChanged,
      };
    case "STATUS_DECLINED":
      return {
        ...state,
        status: action.status,
        review: action.review,
        statusChanged: action.statusChanged,
      };
    case "RESET_CHANGED_STATUS":
      return {
        ...state,
        statusChanged: action.statusChanged,
        requestId: action.requestId,
      };
    default:
      throw new Error("Something went wrong");
  }
};

// review id will be accessed from url params
const Request = ({ globalDispatch }) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initState);
  const [editorHasContent, setEditorHasContent] = useState(false);
  const { reviewId } = useParams();

  useEffect(() => {
    handleInitState();
  }, [reviewId]);

  // set initial state at first render
  const handleInitState = async () => {
    const req = await getReview(reviewId, globalDispatch);
    // TODO error handling for dispatch
    dispatch({
      type: "FETCH_REQUEST",
      status: req.status,
      review: req.embeddedReview,
      requestId: req._id,
    });
  };

  // reviewer header
  const ReviewerHeader = ({ index }) => {
    const user = useContext(userContext);
    if (index) {
      return (
        // TODO job title and avatar
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

  return (
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
            statusChanged={state.statusChanged}
            language={state.review.language}
          />
          <ActionButtons
            status={state.status}
            dispatch={dispatch}
            requestId={state.requestId}
          />
        </React.Fragment>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Request;
