import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
// card imports
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

// API call
import { sendRequest, getRequest } from "../services/reviewRequest";

const useStyles = makeStyles((theme) => ({
  request: {
    margin: theme.spacing(6),
    borderRadius: "0px",
  },
  code: {
    background: "#EAF0F8",
  },
  codeText: {
    overflow: "scroll",
    maxHeight: "15em",
  },
}));

// expecting a review Id to be passed into the component
const Request = ({ reviewId }) => {
  const classes = useStyles();
  // status logic
  const [status, setStatus] = useState(null);
  // store current request
  const [request, setRequest] = useState(null);
  // store current review
  const [review, setReview] = useState(null);

  // API call to get request
  useEffect(() => {
    if (!status) handleInitState();
    if (status === "accepted") sendRequest(true);
    if (status === "declined") sendRequest(false);
  }, [status]);

  // set initial state at first render
  const handleInitState = async (req) => {
    // make sure to remove review id
    const fetchedRequest = await getRequest("5f25daa9c1d256faa18f4cd9");
    setReview(fetchedRequest.data.embeddedReview);
    setStatus(fetchedRequest.data.status);
    setRequest(fetchedRequest.data);
  };

  // sending request to /request when accept/decline
  const sendRequest = async (isAccepted) => {
    await sendRequest(isAccepted, request._id);
  };

  // accept logic
  const handleAccept = () => {
    setStatus("accepted");
  };

  // decline logic
  const handleDecline = () => {
    setStatus("declined");
    setReview(null);
  };

  const placeholderStr =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse maximus id nisi nec eleifend. Nam blandit ornare pretium. Donec eget augue leo. Ut euismod lacinia lacus a iaculis. Curabitur eget ligula id mauris sagittis placerat et eu libero. Sed odio nulla, tincidunt nec risus ac, euismod porta elit. Donec at consectetur quam, et consequat ligula. Nunc interdum enim mi. Suspendisse dictum ligula vel tellus rutrum aliquet. Sed vitae laoreet neque. Nunc pellentesque arcu hendrerit eros ullamcorper interdum. Integer aliquet justo luctus, dignissim justo vitae, faucibus nunc. Morbi laoreet eros orci, id scelerisque nulla blandit sed. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Suspendisse potenti. Vivamus odio justo, pellentesque ut quam in, faucibus sagittis urna. Maecenas justo dui, bibendum id fringilla vitae, pulvinar eget mauris. Praesent condimentum molestie lectus, in scelerisque tortor luctus id. Curabitur sed massa sit amet orci malesuada tincidunt. Sed accumsan pellentesque pulvinar. Vivamus sodales elementum quam eget lobortis. Aliquam erat volutpat.Mauris cursus fringilla facilisis. Donec facilisis efficitur ipsum sed aliquam. Vivamus vulputate nulla sit amet metus viverra, vel semper sem lobortis. Vestibulum id lobortis mi. Curabitur imperdiet, purus a tristique dapibus, tellus arcu molestie velit, vitae vehicula dolor ante a dui. Integer auctor elit mauris, sed faucibus dolor feugiat vel. Interdum et malesuada fames ac ante ipsum primis in faucibus. Duis risus erat, consectetur sed porta quis, tempor congue massa.Duis sed tempor felis, nec ultrices erat. Suspendisse potenti. Vivamus sed lobortis enim, sed venenatis quam. Sed semper non nulla et blandit. Proin nunc quam, bibendum quis ipsum at, gravida vulputate lorem. Sed dui eros, fermentum id dignissim id, tincidunt ac orci. Morbi venenatis ante ac nisl pretium rutrum. Cras mattis gravida ex, in sodales metus ultricies vel.Pellentesque tincidunt faucibus lacus id dictum. Quisque placerat nisi tortor, et dictum urna tempus ac. Etiam vestibulum nisi a auctor vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Vestibulum malesuada euismod ante, sit amet pharetra diam luctus ac. Donec id sem venenatis, vulputate eros eget, congue dolor. Morbi varius enim vitae aliquet egestas. Vestibulum pretium suscipit quam, quis fermentum massa rutrum pulvinar. Etiam sit amet viverra magna. Nunc id eros sed urna varius mattis. Duis at pretium elit, vulputate commodo sapien. Phasellus ligula diam, hendrerit at urna sed, iaculis feugiat tortor. Praesent porta sem ut dictum feugiat. Cras id elit eget massa eleifend sodales id sed odio. Nunc rutrum volutpat augue, at aliquet risus consectetur ut. Sed nec porttitor libero.";

  return (
    <React.Fragment>
      {review ? (
        <Card className={classes.request}>
          <CardHeader title={review.title} />
          <hr></hr>
          {review.messages.map((item) => (
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
                  {/* item.codeSnippet */}
                  {placeholderStr}
                </Typography>
              </CardContent>
            </CardContent>
          ))}
          {status === "accepted" ? (
            // this should show a message text area and a code editor underneath
            <div>Test</div>
          ) : (
            <></>
          )}
          <CardActions>
            {status === "pending" ? (
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
