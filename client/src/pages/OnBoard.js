import React, { useState } from "react";
//Material-ui imports
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Background from "../elements/Background";
import IconButton from "@material-ui/core/IconButton";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import SubmitButton from "../elements/SubmitButton";
import StyledPaper from "../elements/StyledPaper";
import PageHeader from "../elements/PageHeader";

//Onboarding logic imports
const onBoardingLogic = require("../controllers/onBoarding");

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
    textAlign: "center",
  },
  add: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1, 6),
    border: 0,
    borderRadius: 25,
    textTransform: "none",
    fontSize: 16,
  },
  removeIcon: {
    color: theme.palette.button.remove,
  },
}));

export default function OnBoard() {
  const classes = useStyles();

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
  const levels = ["Beginner", "Advanced", "Expert"];

  const [skillList, setSkillList] = useState([{ language: "", level: "" }]);
  const [submitClicked, setSubmitClicked] = useState(false);

  const handleInputChange = (event, index) => {
    const name = event.target.name;
    const language = event.target.value;
    const list = [...skillList];

    list[index][name] = language;
    setSkillList(list);
  };

  const handleAddClick = (event) => {
    event.preventDefault();
    setSkillList([...skillList, { language: "", level: "" }]);
    setSubmitClicked(false);
  };

  const handleRemoveClick = (index) => {
    const list = [...skillList];
    list.splice(index, 1);
    setSkillList(list);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let allValid = true;

    for (let i = 0; i < skillList.length; i++) {
      allValid =
        skillList[i].language && skillList[i].level && allValid ? true : false;
    }
    if (!allValid) {
      setSubmitClicked(true);
    } else {
      const requestPromise = new Promise(async (resolve, reject) => {
        //Send req to API to save skills
        const response = await onBoardingLogic.updateLanguages(skillList);
        resolve(response);
      });

      requestPromise.then((response) => {
        //If response is successful need update view, else possibly create dialog stating error
        if (!response == "Request Failed") {
          //Update View
          //Logs success or fail
          console.log(response.data.message);
        } else {
          //Dialog
        }
      });

      requestPromise.catch((error) => {
        console.error(error);
      });

      console.log(skillList);
      console.log("Submit");
    }
  };

  const InputLine = (props) => {
    return (
      <Grid container alignItems="center" justify="flex-end">
        <Grid item xs={12} sm={1} md={1}>
          <IconButton
            className={classes.removeIcon}
            component="span"
            disabled={
              props.index === 0 && skillList.length === 1 ? true : false
            }
            onClick={() => handleRemoveClick(props.index)}
          >
            <RemoveCircleIcon fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item xs={5} sm md>
          <Typography component="h1" variant="h6">
            Language:
          </Typography>
        </Grid>
        <Grid item xs={7} sm={4} md={4}>
          <TextField
            color="secondary"
            fullWidth
            select
            margin="dense"
            name="language"
            onChange={(e) => handleInputChange(e, props.index)}
            value={props.item.language}
            label={
              submitClicked && props.item.language === ""
                ? "Specify language"
                : null
            }
            variant="outlined"
            error={submitClicked && props.item.language === "" ? true : false}
          >
            <MenuItem value={props.item.language}>
              {props.item.language}
            </MenuItem>
            {languages.map((item, index) => {
              if (skillList.map((item) => item.language).includes(item)) {
                return null;
              } else {
                return (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                );
              }
            })}
          </TextField>
        </Grid>
        <Grid item xs={5} sm md>
          <Typography component="h1" variant="h6">
            Level:
          </Typography>
        </Grid>
        <Grid item xs={7} sm={3} md={4}>
          <TextField
            fullWidth
            select
            margin="dense"
            name="level"
            onChange={(e) => handleInputChange(e, props.index)}
            value={props.item.level}
            label={
              submitClicked && props.item.level === ""
                ? "Specify your skill level"
                : null
            }
            variant="outlined"
            error={submitClicked && props.item.level === "" ? true : false}
          >
            {levels.map((item, index) => {
              return (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              );
            })}
          </TextField>
        </Grid>
      </Grid>
    );
  };

  return (
    <Background gradient>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <StyledPaper mt={12}>
          <PageHeader>Add your exprerience here:</PageHeader>
          <form className={classes.form}>
            {skillList.map((item, index) => {
              return <InputLine key={item + index} item={item} index={index} />;
            })}

            <Grid container direction="column">
              <Grid item>
                <Button
                  size="large"
                  type="submit"
                  variant="text"
                  color="primary"
                  className={classes.add}
                  disabled={skillList.length >= languages.length ? true : false}
                  onClick={handleAddClick}
                >
                  <AddCircleIcon fontSize="large" />
                  <span display="none" style={{ marginLeft: ".5rem" }}>
                    <Box display={{ xs: "none", sm: "block" }}>
                      Add language
                    </Box>
                    <Box display={{ xs: "block", sm: "none" }}>Add</Box>
                  </span>
                </Button>
              </Grid>
              <Grid item>
                <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
              </Grid>
            </Grid>
          </form>
        </StyledPaper>
      </Container>
    </Background>
  );
}
