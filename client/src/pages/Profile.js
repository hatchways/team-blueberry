import React, { useState, useContext, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import userContext from "../userContext";
import AvatarImage from "./Profile/img/avatar.png";
import ProfileStats from "./Profile/ProfileStats";
// import ProfileProjects from "./Profile/ProfileProjects";
import Background from "../elements/Background";
import ProfileSkills from "./Profile/ProfileSkills";
import ProfileName from "./Profile/ProfileName";
import ProfileComments from "./Profile/ProfileComments";
import ProfileProjects from "./Profile/ProfileProjects";
//Material UI imports
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import {
  createUserAvatar,
  editUser,
  fetchProfile,
  fetchReviewsCount,
  fetchProfileComments,
} from "../services";

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
  divider: {
    marginRight: "-5vh",
    marginLeft: "-5vh",
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    alignSelf: "stretch",
  },
}));

const Profile = ({ state, dispatch }) => {
  const { ...user } = useContext(userContext);
  const classes = useStyles();
  // TODO Consider using reducer to simplify this
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(null);
  const [position, setPosition] = useState(null);
  const [company, setCompany] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [languages, setLanguage] = useState([]);
  const [projects, setProjects] = useState([]);
  const [rating, setRating] = useState(null);
  const [files, setFiles] = useState([]);
  const [reviewsNum, setReviewsNum] = useState(null);
  const [comments, setComments] = useState([]);
  let { userId } = useParams();
  const handleEdit = () => {
    setEdit(!edit);
  };

  const handleInitState = useCallback(
    async (userId) => {
      if (userId !== user.id) {
        const userProfile = await fetchProfile(userId);
        setName(userProfile.name);
        setPosition(userProfile.position);
        setCompany(userProfile.company);
        setAvatar(userProfile.avatar);
        setLanguage(userProfile.languages);
        setProjects(userProfile.projects);
        setRating(userProfile.rating);
        setReviewsNum(await fetchReviewsCount(userId));
        setComments(await fetchProfileComments(userId));
      } else {
        setName(user.name);
        setPosition(user.position);
        setCompany(user.company);
        setRating(user.rating);
        setComments(await fetchProfileComments(user.id));
        setProjects(user.projects);
        setReviewsNum(await fetchReviewsCount(user.id));
      }
    },
    [
      user.company,
      user.id,
      user.name,
      user.position,
      user.projects,
      user.rating,
    ]
  );

  useEffect(() => {
    handleInitState(userId);
  }, [userId, handleInitState]);

  const submit = (event) => {
    event.preventDefault();
    if (files.length) {
      createUserAvatar(files[0].bin)(dispatch);
    }
    if (name) {
      editUser({ name, position, company })(dispatch);
    }
    handleEdit();
  };
  const editName = (event) => setName(event.target.value);
  const editPosition = (event) => setPosition(event.target.value);
  const editCompany = (event) => setCompany(event.target.value);
  let years = null;
  if (userId === user.id) {
    years = user.languages.reduce((summ, item) => {
      return summ + item.level;
    }, 0);
  } else {
    years = languages.reduce((summ, item) => {
      return summ + item.level;
    }, 0);
  }

  return (
    <Background solid>
      <Box flexWrap="nowrap" width={"100%"}>
        <Grid container direction="column">
          <Grid item>
            <Container component="main" maxWidth="md" className={classes.root}>
              {userId === user.id ? (
                <Avatar
                  alt="Profile image"
                  src={user.avatar || AvatarImage}
                  className={classes.avatar}
                />
              ) : (
                <Avatar
                  alt="Profile image"
                  src={avatar || AvatarImage}
                  className={classes.avatar}
                />
              )}

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
                    position={position}
                    company={company}
                    editName={editName}
                    editPosition={editPosition}
                    editCompany={editCompany}
                    files={files}
                    setFiles={setFiles}
                  />
                  {userId === user.id ? (
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
                  ) : null}
                  <Divider className={classes.divider} light />
                  <ProfileStats
                    years={years}
                    reviews={reviewsNum}
                    rating={rating ? rating.toFixed(1) : null}
                  />
                  <Divider className={classes.divider} light />
                  <ProfileSkills
                    skills={userId === user.id ? user.languages : languages}
                  />

                  {userId !== user.id && projects.length === 0 ? null : (
                    <React.Fragment>
                      <Divider className={classes.divider} light />
                      <ProfileProjects
                        projects={projects}
                        dispatch={dispatch}
                        showEdit={userId !== user.id}
                      />
                    </React.Fragment>
                  )}

                  {comments.length ? (
                    <React.Fragment>
                      <Divider className={classes.divider} light />
                      <ProfileComments comments={comments} />
                    </React.Fragment>
                  ) : null}
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
