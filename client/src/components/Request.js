import React, { useState, useEffect, useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import { useParams } from "react-router-dom";

// API call
import { sendRequest } from "../services/reviewRequest";
import { getReview } from "../services/reviews";
import { sendMessage } from "../services/sendReviewMessage";

// code editor
import PrismEditor from "../components/Editor/DraftEditor";

const useStyles = makeStyles((theme) => ({
  request: {
    margin: theme.spacing(6),
    borderRadius: "0px",
    overflow: "scroll",
  },
  code: {
    background: "#EAF0F8",
  },
  codeText: {
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
    const [message, setMessage] = useState("");
    const [makeSubmit, setMakeSubmit] = useState(false);
    const [editorHasContent, setEditorHasContent] = useState(false);

    const handleSubmit = async (text) => {
      const request = {
        content: text,
      };
      // TODO saving codeSnippet as an object to be read by Prism Code Component
      try {
        const req = await sendMessage(reviewId, message, request);
        dispatch({
          type: "FETCH_REQUEST",
          review: req.embeddedReview,
          requestId: req._id,
        });
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
            <TextField
              label="Message"
              multiline
              rows={2}
              variant="filled"
              fullWidth={true}
              onChange={(e) => setMessage(e.target.value)}
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
  return (
    <React.Fragment>
      {state.review ? (
        <Card className={classes.request}>
          <CardHeader title={state.review.title} />
          <hr></hr>
          {state.review.messages.map((item, index) => (
            <React.Fragment key={item._id}>
              <ReviewerHeader index={index} />
              <CardContent>
                <Typography variant="body2" component="p">
                  {item.messageText}
                </Typography>
                <CardContent className={classes.code}>
                  <Typography
                    variant="body2"
                    component="p"
                    className={classes.codeText}
                  >
                    {item.codeSnippet}
                  </Typography>
                </CardContent>
              </CardContent>
            </React.Fragment>
          ))}
          <MessageField reviewId={reviewId} dispatch={dispatch} />
          <ActionButtons />
        </Card>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

export default Request;
