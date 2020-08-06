import React, { useState, useContext } from "react";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";

import PageHeader from "../elements/PageHeader";
import AvatarImage from "./Profile/img/avatar.png";
import ProfileStats from "./Profile/ProfileStats";
import ProfileProjects from "./Profile/ProfileProjects";

import Background from "../elements/Background";
import Navbar from "../components/Navbar";
import ProfileSkills from "./Profile/ProfileSkills";
import ProfileName from "./Profile/ProfileName";
import userContext from "../userContext";
import { createUserAvatar, editUser } from "../services";

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
  iconEdit: {
    color: "gray",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const Profile = ({ state, dispatch }) => {
  const { languages = [], projects = [], ...user } = useContext(userContext);
  const classes = useStyles();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(user.name);
  const [about, setAbout] = useState("Apple Chief Officer");
  const [files, setFiles] = useState([]);
  const skills = [
    { language: "JavaScript", level: "Advanced" },
    { language: "Java", level: "Expert" },
    { language: "PHP", level: "Expert" },
    { language: "C++", level: "Beginner" },
  ];

  const handleEdit = () => {
    setEdit(!edit);
  };

  const submit = (event) => {
    event.preventDefault();
    if (files.length) {
      createUserAvatar(files[0].bin)(dispatch);
      editUser({ name })(dispatch);
    }
    handleEdit();
  };
  const editName = (event) => setName(event.target.value);

  const editAbout = (event) => setAbout(event.target.value);

  return (
    <Background solid>
      <Avatar
        alt="Profile image"
        src={user.avatar || AvatarImage}
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
          <ProfileName
            edit={edit}
            name={name}
            about={about}
            editName={editName}
            editAbout={editAbout}
            files={files}
            setFiles={setFiles}
          />

          <Grid item xs={1}>
            {!edit && (
              <EditIcon
                fontSize="large"
                className={classes.iconEdit}
                onClick={handleEdit}
              />
            )}
            {edit && (
              <Button
                variant="contained"
                size="small"
                className={classes.button}
                onClick={submit}
              >
                Save
              </Button>
            )}
          </Grid>
          <Grid item>
            <Box mt={8} />
          </Grid>
          <ProfileStats years="5" reviews="10" rating="4.7" />
          <Grid item>
            <Box mt={8} />
          </Grid>
          <ProfileSkills skills={languages} />
          <Grid item>
            <Box mt={8} mb={5}>
              <PageHeader>Projects</PageHeader>
            </Box>
          </Grid>
          <ProfileProjects projects={projects} />
        </Grid>
      </Paper>
    </Background>
  );
};

export default Profile;
