import React from "react";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";

// accept & reject button
const ActionButtons = ({ status, dispatch }) => {
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

  if (status === "pending") {
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

export default ActionButtons;
