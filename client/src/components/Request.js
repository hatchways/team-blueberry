import React, { useState, useEffect, useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { useParams } from "react-router-dom";
import { Divider } from "@material-ui/core";

// API call
import { sendRequest } from "../services/reviewRequest";
import { getReview } from "../services/reviews";
import { sendMessage } from "../services/sendReviewMessage";

// code editor
import PrismEditor from "../components/Editor/DraftEditor";
import { convertFromRaw } from "draft-js";

const useStyles = makeStyles((theme) => ({
  request: {
    borderRadius: "0px",
    overflow: "scroll",
  },
  message: {
    overflow: "scroll",
    maxHeight: "20em",
  },
  messageBtn: {
    paddingTop: 0,
    paddingBottom: 0,
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

  // API call to get request
  useEffect(() => {
    handleInitState();
    if (state.statusChanged && state.status === "accepted") {
      sendRequest(true, state.requestId);
      dispatch({
        type: "RESET_CHANGED_STATUS",
        statusChanged: false,
      });
    }
    if (state.statusChanged && state.status === "declined") {
      sendRequest(false, state.requestId);
      dispatch({
        type: "RESET_CHANGED_STATUS",
        statusChanged: false,
        requestId: "",
      });
    }
  }, [reviewId]);

  // set initial state at first render
  const handleInitState = async () => {
    const req = await getReview(reviewId, globalDispatch);
    // handle if getReview is null
    dispatch({
      type: "FETCH_REQUEST",
      status: req.status,
      review: req.embeddedReview,
      requestId: req._id,
    });
  };

  // accept & reject button
  const ActionButtons = () => {
    // accept logic
    const handleAccept = () => {
      dispatch({
        type: "STATUS_ACCEPTED",
        status: "accepted",
        statusChanged: true,
      });
    };

    // // decline logic
    const handleDecline = () => {
      dispatch({
        type: "STATUS_DECLINED",
        status: "declined",
        review: null,
        statusChanged: true,
      });
    };

    if (state.status === "pending") {
      return (
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleAccept()}
          >
            Accept
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => handleDecline()}
          >
            Decline
          </Button>
        </CardActions>
      );
    } else return <></>;
  };

  // message field and button
  const MessageField = ({ dispatch, reviewId }) => {
    const [makeSubmit, setMakeSubmit] = useState(false);
    const [editorHasContent, setEditorHasContent] = useState(false);
    let isMounted = false;

    useEffect(() => {
      isMounted = true;
    }, []);

    const handleSubmit = async (text) => {
      const request = {
        content: text,
      };
      try {
        if (isMounted) {
          const req = await sendMessage(reviewId, request);
          dispatch({
            type: "FETCH_REQUEST",
            review: req.embeddedReview,
            requestId: req._id,
          });
        } else {
          return;
        }
      } catch (err) {
        // TODO handle error better
        console.error(err.message);
      }
      setMakeSubmit(false);
    };

    const startSubmit = () => {
      setMakeSubmit(true);
    };

    const handleHasContent = (value) => {
      setEditorHasContent(value);
    };
    if (state.status === "accepted") {
      return (
        <React.Fragment>
          <CardContent>
            <CardHeader
              avatar={<Avatar>UI</Avatar>}
              title="User's Name"
              subheader="User's Job"
            />
          </CardContent>
          <CardContent>
            <Typography>Write Code: </Typography>
            <PrismEditor
              language={state.review.language}
              makeSubmit={makeSubmit}
              onSubmit={handleSubmit}
              hasContent={handleHasContent}
            ></PrismEditor>
          </CardContent>
          <CardContent className={classes.messageBtn}>
            <Button color="primary" variant="contained" onClick={startSubmit}>
              Submit
            </Button>
          </CardContent>
        </React.Fragment>
      );
    } else return <></>;
  };

  const ReviewerHeader = ({ index }) => {
    if (index) {
      return (
        // TODO access to user's name and job title here
        <CardHeader
          avatar={<Avatar>UI</Avatar>}
          title="User's Name"
          subheader="User's Job"
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
              <ReviewerHeader />
              <CardContent>
                <PrismEditor
                  language={state.review.language}
                  hasContent={handleHasContent}
                  readOnly
                  content={JSON.parse(convertFromRaw(item.nmessage))}
                ></PrismEditor>
              </CardContent>
            </React.Fragment>
          ))}
          <MessageField reviewId={reviewId} dispatch={dispatch} />
          <ActionButtons />
        </React.Fragment>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Request;
