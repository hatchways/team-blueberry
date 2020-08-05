import React, { useEffect, useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

// API call
import { sendRequest, getRequest } from "../services/reviewRequest";

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
    case "FETCH_REQ":
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
const Request = () => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(reducer, initState);

  // API call to get request
  useEffect(() => {
    if (!state.status) {
      handleInitState();
    }
    if (state.statusChanged && state.status === "accepted") {
      sendRequest(true, state.requestId);
      dispatch({
        type: "RESET_CHANGED_STATUS",
        statusChanged: false,
      });
    }
    if (state.statusChanged && state.status === "declined") {
      sendRequest(false, state.requestId);
      console.log(state.requestId);
      dispatch({
        type: "RESET_CHANGED_STATUS",
        statusChanged: false,
        requestId: "",
      });
    }
  }, [state.status]);

  // set initial state at first render
  const handleInitState = async () => {
    // make sure to remove review id
    const req = await getRequest("5f25daa9c1d256faa18f4cd9");
    dispatch({
      type: "FETCH_REQ",
      status: req.data.status,
      review: req.data.embeddedReview,
      requestId: req.data._id,
    });
  };

  // accept & reject button
  const ActionButtons = () => {
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

  // message field and button
  const MessageField = () => {
    if (state.status === "accepted") {
      return (
        // this should show a message text area and a code editor underneath
        <React.Fragment>
          <CardContent>
            <TextField
              label="Message"
              multiline
              rows={6}
              variant="filled"
              fullWidth={true}
              // TODO - handle text field change
            />
          </CardContent>
          <CardContent className={classes.messageBtn}>
            <Button
              color="primary"
              variant="contained"
              // TODO - handle submit message button click
            >
              Submit
            </Button>
          </CardContent>
        </React.Fragment>
      );
    } else return <></>;
  };

  return (
    <React.Fragment>
      {state.review ? (
        <Card className={classes.request}>
          <CardHeader title={state.review.title} />
          <hr></hr>
          {state.review.messages.map((item) => (
            <CardContent key={item._id}>
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
          ))}
          <MessageField />
          <ActionButtons />
        </Card>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

export default Request;
