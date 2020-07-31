import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import DialogContent from "@material-ui/core/DialogContent";
import PageHeader from "../elements/PageHeader";
import SubmitButton from "../elements/SubmitButton";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import PrismEditor from "../components/Editor/DraftEditor";
import MenuItem from "@material-ui/core/MenuItem";
import { Box } from "@material-ui/core";
import Alert from "../elements/SnackBar";

export default function AddCodeDialog(props) {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [makeSubmit, setMakeSubmit] = useState(false);
  const [editorHasContent, setEditorHasContent] = useState(false);
  const [error, setError] = useState(false);
  const languages = [
    "Python",
    "JavaScript",
    "Java",
    "PHP",
    "GoLang",
    "C#",
    "C++",
    "Ruby",
  ];
  const handleSubmit = (text) => {
    //Wrap up data and send to server.
    const request = {
      title: title,
      language: languages,
      content: text,
    };

    //SEND REQUEST AND close dialog
    console.log(request);
    setTitle("");
    setLanguage("");
    setMakeSubmit(false);
    props.handleClose();
  };

  const handleHasContent = (value) => {
    setEditorHasContent(value);
  };

  const startSubmit = () => {
    if (!language || !title || !editorHasContent) {
      setError(true);
    } else {
      setMakeSubmit(true);
    }
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth="md"
        open={props.open}
        onClose={props.handleClose}
      >
        <DialogContent>
          <PageHeader>Request a code review</PageHeader>
          <Box mt={5} mb={5} pl={5} pr={5}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={8} md={8}>
                <Typography component="h1" variant="h6">
                  Title:
                </Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <Typography component="h1" variant="h6">
                  Language:
                </Typography>
                <TextField
                  fullWidth
                  select
                  name="language"
                  value={language}
                  variant="outlined"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {languages.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item}>
                        {item}
                      </MenuItem>
                    );
                  })}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <PrismEditor
                  language={language}
                  makeSubmit={makeSubmit}
                  onSubmit={handleSubmit}
                  hasContent={handleHasContent}
                ></PrismEditor>
              </Grid>
              <Grid item container justify="center">
                <SubmitButton onClick={startSubmit}>Submit</SubmitButton>
              </Grid>
              <Alert
                open={error ? true : false}
                onClick={() => setError(false)}
              >
                Fill in all the fields
              </Alert>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
