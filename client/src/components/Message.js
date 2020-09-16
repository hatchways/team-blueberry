import React, { useState, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PrismEditor from "./Editor/DraftEditor";
import { sendMessage } from "../services/sendReviewMessage";
import userContext from "../userContext";
import { guestRequest, demoRequest } from "../guestData";

const useStyles = makeStyles((theme) => ({
  messageBtn: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

const Message = ({
  dispatch,
  reviewId,
  status,
  language,
  userOwner,
  selectedReviewer,
}) => {
  const classes = useStyles();
  const [makeSubmit, setMakeSubmit] = useState(false);
  const [, setEditorHasContent] = useState(false);
  const user = useContext(userContext);
  const [num, setNum] = useState(1);
  const handleSubmit = async (text) => {
    setMakeSubmit(false);
    if (reviewId !== "guestreview" && reviewId !== "demoreview") {
      await sendMessage(reviewId, text.text, dispatch);
    } else if (reviewId === "demoreview") {
      demoRequest.embeddedReview.messages.push({
        _id: `guestmessage${num}`,
        message: JSON.stringify(text.text),
        messagePostedBy: "guest",
        messagePostDate: new Date(),
      });
      dispatch({
        type: "SEND_MESSAGE_SUCCESS",
        review: demoRequest.embeddedReview,
        requestId: demoRequest._id,
      });
      let number = num + 1;
      setNum(number);
    } else if (reviewId === "guestreview") {
      guestRequest.embeddedReview.messages.push({
        _id: `guestmessage${num}`,
        message: JSON.stringify(text.text),
        messagePostedBy: "guest",
        messagePostDate: new Date(),
      });
      dispatch({
        type: "SEND_MESSAGE_SUCCESS",
        review: guestRequest.embeddedReview,
        requestId: guestRequest._id,
      });
      let number = num + 1;
      setNum(number);
    }
  };

  const startSubmit = () => {
    setMakeSubmit(true);
  };

  const handleHasContent = (value) => {
    setEditorHasContent(value);
  };
  if (
    status === "accepted" &&
    (user.id === userOwner ||
      (selectedReviewer && user.id === selectedReviewer))
  ) {
    return (
      <React.Fragment>
        <CardContent>
          <Typography>Write message: </Typography>
          <PrismEditor
            language={language}
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
  } else return null;
};

export default Message;
