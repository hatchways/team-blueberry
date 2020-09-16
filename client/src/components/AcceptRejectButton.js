import React, { useContext } from "react";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import { sendRequest } from "../services/reviewRequest";
import userContext from "../userContext";
import { usersData, demoRequest } from "../guestData";

// accept & reject button
const ActionButtons = ({ status, dispatch, requestId, selectedReviewer }) => {
  // accept logic
  const user = useContext(userContext);
  const handleAccept = async () => {
    if (user.id !== "guest") {
      await sendRequest(true, requestId, dispatch);
    } else {
      demoRequest.status = "accepted";
      dispatch({
        type: "STATUS_ACCEPTED",
        status: "accepted",
        selectedReviewer: { ...usersData.guest, _id: usersData.guest.id },
      });
    }
  };

  // // decline logic
  const handleDecline = async () => {
    if (user.id !== "guest") {
      await sendRequest(false, requestId, dispatch);
    } else {
      demoRequest.status = "declined";
      dispatch({
        type: "STATUS_DECLINED",
        status: "declined",
        selectedReviewerId: null,
      });
    }
  };
  if (
    status === "pending" &&
    selectedReviewer &&
    user.id === selectedReviewer
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
