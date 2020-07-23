import React, { useState } from 'react';
//Material-ui imports
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Background from '../elements/Background';
import IconButton from '@material-ui/core/IconButton';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(12),
    padding: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  headerText: {
    marginTop: theme.spacing(10)
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
    textAlign: 'center'
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1, 6),
    border: 0,
    borderRadius: 25,
    color: '#fff',
    textTransform: 'none',
    fontSize: 15
  },
  add: {
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1, 6),
    border: 0,
    borderRadius: 25,
    textTransform: 'none',
    fontSize: 16
  },
  removeIcon: {
    color: theme.palette.button.remove
  }
}));

export default function OnBoard() {
  const classes = useStyles();

  const languages = [ 'Python', 'JavaScript', 'Java', 'PHP', 'GoLang', 'C#', 'C++', 'Ruby' ];
  const levels = [ 'Beginner', 'Advanced', 'Expert' ];

  const [ skillList, setSkillList ] = useState([ { language: '', level: '' } ]);
  const [ submitClicked, setSubmitClicked ] = useState(false);

  const handleInputChange = (event, index) => {
    const name = event.target.name;
    const language = event.target.value;
    const list = [ ...skillList ];

    list[index][name] = language;
    setSkillList(list);
  };

  const handleAddClick = (event) => {
    event.preventDefault();
    setSkillList([ ...skillList, { language: '', level: '' } ]);
    setSubmitClicked(false);
  };

  const handleRemoveClick = (index) => {
    const list = [ ...skillList ];
    list.splice(index, 1);
    setSkillList(list);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let allValid = true;

    for (let i = 0; i < skillList.length; i++) {
      allValid = skillList[i].language && skillList[i].level && allValid ? true : false;
    }
    if (!allValid) {
      setSubmitClicked(true);
    } else {
      //Send req to API to save skills
      console.log(skillList);
      console.log('Submit');
    }
  };

  const InputLine = (props) => {
    return (
      <Grid container alignItems="center" justify="flex-end">
        <Grid item xs>
          <IconButton
            className={classes.removeIcon}
            aria-label="upload picture"
            component="span"
            disabled={props.index === 0 && skillList.length === 1 ? true : false}
            onClick={() => handleRemoveClick(props.index)}
          >
            <RemoveCircleIcon fontSize="large" />
          </IconButton>
        </Grid>
        <Grid item xs>
          <Typography component="h1" variant="h6">
            Language:
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <TextField
            color="secondary"
            fullWidth
            select
            margin="dense"
            name="language"
            onChange={(e) => handleInputChange(e, props.index)}
            value={props.item.language}
            label={submitClicked && props.item.language === '' ? 'Specify language' : null}
            variant="outlined"
            error={submitClicked && props.item.language === '' ? true : false}
          >
            <MenuItem value={props.item.language}>{props.item.language}</MenuItem>
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
        <Grid item xs>
          <Typography component="h1" variant="h6">
            Level:
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            select
            margin="dense"
            name="level"
            onChange={(e) => handleInputChange(e, props.index)}
            value={props.item.level}
            label={submitClicked && props.item.level === '' ? 'Specify your skill level' : null}
            variant="outlined"
            error={submitClicked && props.item.level === '' ? true : false}
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
        <Paper elevation={3} className={classes.paper}>
          <Box mt={2} fontSize="h4.fontSize" fontWeight="fontWeightBold">
            Add your exprerience here:
          </Box>
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
                  <span style={{ marginLeft: '.5rem' }}>Add language</span>
                </Button>
              </Grid>
              <Grid item>
                <Button
                  size="large"
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={handleSubmit}
                  startIcon={<AddCircleIcon />}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Background>
  );
}
