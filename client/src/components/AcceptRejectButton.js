import React, { useContext } from "react";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import { sendRequest } from "../services/reviewRequest";
import userContext from "../userContext";

// accept & reject button
const ActionButtons = ({ status, dispatch, requestId, selectedReviewer }) => {
  // accept logic
  const user = useContext(userContext);
  const handleAccept = () => {
    sendRequest(true, requestId);
    dispatch({
      type: "STATUS_ACCEPTED",
      status: "accepted",
      statusChanged: true,
    });
  };

  // // decline logic
  const handleDecline = () => {
    sendRequest(false, requestId);
    dispatch({
      type: "STATUS_DECLINED",
      status: "declined",
      review: null,
      statusChanged: true,
    });
  };

  if (status === "pending" && user.id === selectedReviewer) {
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
  } else return null;
};

export default ActionButtons;
