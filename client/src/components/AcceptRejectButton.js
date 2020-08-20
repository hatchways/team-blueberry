import React, { useContext } from "react";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import { sendRequest } from "../services/reviewRequest";
import userContext from "../userContext";

// accept & reject button
const ActionButtons = ({ status, dispatch, requestId, selectedReviewer }) => {
  // accept logic
  const user = useContext(userContext);
  const handleAccept = async () => {
    await sendRequest(true, requestId, dispatch);
  };

  // // decline logic
  const handleDecline = async () => {
    await sendRequest(false, requestId, dispatch);
  };

  if (
    status === "pending" &&
    selectedReviewer &&
    user.id === selectedReviewer.id
  ) {
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
