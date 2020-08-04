import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import AvatarImage from "./img/avatar.png";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import PageHeader from "../elements/PageHeader";
import ProfileStats from "./Profile/ProfileStats";
import ProfileProjects from "./Profile/ProfileProjects";
import Background from "../elements/Background";
import Navbar from "../components/Navbar";
import ProfileSkills from "./Profile/ProfileSkills";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "relative",
  },
  paper: {
    textAlign: "center",
    padding: "5vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: theme.spacing(12),
    marginBottom: theme.spacing(12),
  },
  avatar: {
    width: theme.spacing(18),
    height: theme.spacing(18),
    position: "absolute",
    left: "50%",
    padding: 0,
    margin: 0,
    transform: "translate(-50%, -50%)",
    border: "3px solid #fff",
  },
}));

const Profile = ({ state, dispatch }) => {
  const classes = useStyles();
  const skills = [
    { language: "JavaScript", level: "Advanced" },
    { language: "Java", level: "Expert" },
    { language: "PHP", level: "Expert" },
    { language: "C++", level: "Beginner" },
  ];
  const projects = [
    { title: "JS Code Review", link: "http://localhost:3000/" },
    { title: "New Java Code", link: "http://localhost:3000/" },
  ];

  return (
    <Background solid>
      <Box flexWrap="nowrap" width={"100%"}>
        <Grid container direction="column">
          <Grid item>
            <Navbar state={state} dispatch={dispatch} />
          </Grid>
          <Grid item>
            <Container component="main" maxWidth="md" className={classes.root}>
              <Avatar
                alt="Profile image"
                src={AvatarImage}
                className={classes.avatar}
              />
              <Paper className={classes.paper}>
                <Grid
                  item
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                >
                  <Grid item>
                    <Box mt={7}>
                      <PageHeader>Steve Jobs</PageHeader>
                      <Typography variant="subtitle1">
                        Apple Chief Officer
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item>
                    <Box mt={8} />
                  </Grid>
                  <ProfileStats years="5" reviews="10" rating="4.7" />
                  <Grid item>
                    <Box mt={8} />
                  </Grid>
                  <ProfileSkills skills={skills} />
                  <Grid item>
                    <Box mt={8} mb={5}>
                      <PageHeader>Projects</PageHeader>
                    </Box>
                  </Grid>
                  <ProfileProjects projects={projects} />
                </Grid>
              </Paper>
            </Container>
          </Grid>
        </Grid>
      </Box>
    </Background>
  );
};

export default Profile;
