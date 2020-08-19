import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PrismEditor from "./Editor/DraftEditor";
import { sendMessage } from "../services/sendReviewMessage";

const useStyles = makeStyles((theme) => ({
  messageBtn: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

const Message = ({ dispatch, reviewId, status, language }) => {
  const classes = useStyles();
  const [makeSubmit, setMakeSubmit] = useState(false);
  const [editorHasContent, setEditorHasContent] = useState(false);

  const handleSubmit = async (text) => {
    setMakeSubmit(false);
    await sendMessage(reviewId, text.text, dispatch);
  };

  const startSubmit = () => {
    setMakeSubmit(true);
  };

  const handleHasContent = (value) => {
    setEditorHasContent(value);
  };
  if (status === "accepted") {
    return (
      <React.Fragment>
        <CardContent>
          <Typography>Write message</Typography>
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
