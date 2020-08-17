import React, { useState, useContext } from "react";
import userContext from "../userContext";
import AvatarImage from "./Profile/img/avatar.png";
import ProfileStats from "./Profile/ProfileStats";
// import ProfileProjects from "./Profile/ProfileProjects";
import Background from "../elements/Background";
import ProfileSkills from "./Profile/ProfileSkills";
import ProfileName from "./Profile/ProfileName";
//Material UI imports
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { createUserAvatar, editUser } from "../services";

// profile name, company, position
import PageHeader from "../elements/PageHeader";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import DropZone from "./Profile/Dropzone";

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
  const [position, setPosition] = useState(user.position);
  const [company, setCompany] = useState(user.company);
  const [files, setFiles] = useState([]);
  const handleEdit = () => {
    setEdit(!edit);
  };

  const submit = (event) => {
    event.preventDefault();
    // TODO set up s3 for images
    if (files.length) {
      createUserAvatar(files[0].bin)(dispatch);
    }
    if (name) {
      editUser({ name, position, company })(dispatch);
      handleEdit();
    }
  };
  const editName = (event) => setName(event.target.value);

  const editPosition = (event) => setPosition(event.target.value);

  const editCompany = (event) => setCompany(event.target.value);
  return (
    <Background solid>
      <Box flexWrap="nowrap" width={"100%"}>
        <Grid container direction="column">
          <Grid item>
            <Container component="main" maxWidth="md" className={classes.root}>
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
                  {/* <ProfileName
                    edit={edit}
                    name={user.name}
                    position={user.position}
                    company={user.company}
                    editName={editName}
                    editPosition={editPosition}
                    editCompany={editCompany}
                    files={files}
                    setFiles={setFiles}
                  /> */}
                  {/* Textfields were not responsive inside a child component, any other solution other than putting it back into parent componet? */}
                  {edit ? (
                    <Grid item container direction="column" spacing={3}>
                      <Grid item>
                        <Box mt={7} />
                        <DropZone files={files} setFiles={setFiles} />
                      </Grid>
                      <Grid item>
                        <TextField
                          fullWidth
                          color="primary"
                          defaultValue={name}
                          onChange={editName}
                          variant="outlined"
                          label="Name"
                          xs={6}
                          error={!name ? true : false}
                          helperText={!name ? "Name cannot be blank!" : null}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          fullWidth
                          color="primary"
                          defaultValue={company}
                          onChange={editCompany}
                          variant="outlined"
                          label="Company"
                          xs={6}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          fullWidth
                          color="primary"
                          defaultValue={position}
                          onChange={editPosition}
                          variant="outlined"
                          label="Position"
                          xs={6}
                        />
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid item>
                      <Box mt={7}>
                        <PageHeader>{name}</PageHeader>
                        <Typography variant="subtitle1">
                          {position && company
                            ? `${position} at ${company}`
                            : position
                            ? `${position}`
                            : company
                            ? `${company}`
                            : null}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
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
                    <Box mt={10} />
                  </Grid>
                  <ProfileStats years="5" reviews="10" rating="4.7" />
                  <Grid item>
                    <Box mt={10} />
                  </Grid>
                  <ProfileSkills skills={user.languages} />
                  {/* <ProfileProjects projects={projects} /> */}
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
