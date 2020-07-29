import React, { useState } from "react";
// import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
// import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import PageHeader from "../elements/PageHeader";
import SubmitButton from "../elements/SubmitButton";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import PrismEditor from "../components/Editor/DraftEditor";
import MenuItem from "@material-ui/core/MenuItem";
import { Box } from "@material-ui/core";

// const useStyles = makeStyles((theme) => ({}));

export default function AddCodeDialog() {
  // const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("SUBMIT");
  };
  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="primary"
        onClick={() => {
          setOpen(!open);
        }}
      >
        Open max-width dialog
      </Button>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={() => {
          setOpen(!open);
        }}
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
                <PrismEditor language={language}></PrismEditor>
              </Grid>
              <Grid item container justify="center">
                <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
