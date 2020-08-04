import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
// card imports
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
    minHeight: "100vh",
  },
  code: {
    background: "#EAF0F8",
  },
  codeText: {
    overflow: "scroll",
    maxHeight: "20em",
  },
}));

// expecting a review Id to be passed into the component
const Request = ({ reviewId }) => {
  const classes = useStyles();
  // would it be better to keep data inside one state, or have several state?
  // store current request
  const [request, setRequest] = useState(null);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(false);
  const [message, setMessage] = useState("");

  // API call to get request
  useEffect(() => {
    if (!request) handleInitState();
    else if (!submitClicked) {
      if (request.status === "accepted") postRequest(true);
      if (request.status === "declined") postRequest(false);
      setSubmitClicked(true);
    } else if (submitMessage) {
      // api call to update data
      console.log(request.embeddedReview);
    }
  }, [request]);

  // set initial state at first render
  const handleInitState = async (req) => {
    const fetchedRequest = await getRequest(reviewId);
    setRequest(fetchedRequest.data);
  };

  // sending request to /request when accept/decline
  const postRequest = async (isAccepted) => {
    await sendRequest(isAccepted, request._id);
  };

  // accept logic
  const handleAccept = () => {
    setRequest({ ...request, status: "accepted" });
  };

  // decline logic
  const handleDecline = () => {
    setRequest({ request: null });
  };

  // handle submitting message and code
  const handleSubmit = (event) => {
    event.preventDefault();
    // placeholder request to update DB
    setRequest((request) => {
      request.embeddedReview.messages.push({
        _id: "hadsfkaf",
        messageText: "Hello there",
        codeSnippet: "New code",
      });
      return { ...request };
    });
    setSubmitMessage(true);
  };

  return (
    <React.Fragment>
      {request && request.embeddedReview ? (
        <Card className={classes.request}>
          <CardHeader title={request.embeddedReview.title} />
          <hr></hr>
          {request.embeddedReview.messages.map((item) => (
            <CardContent key={item._id}>
              <Typography variant="body2" component="p">
                {item.messageText}
              </Typography>
              {/* put another card to hold code snippet */}
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
          {request.status === "accepted" && !submitMessage ? (
            // this should show a message text area and a code editor underneath
            <React.Fragment>
              <CardContent>
                <TextField
                  label="Message"
                  multiline
                  rows={6}
                  variant="filled"
                  fullWidth={true}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </CardContent>
              <Button
                color="primary"
                variant="contained"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </React.Fragment>
          ) : (
            <></>
          )}
          <CardActions>
            {request.status === "pending" ? (
              <React.Fragment>
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
              </React.Fragment>
            ) : (
              <></>
            )}
          </CardActions>
        </Card>
      ) : (
        <></>
      )}
    </React.Fragment>
  );
};

export default Request;
