import React, { useState } from "react";
import CodeImg from "./img/code.jpg";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import PageHeader from "../../elements/PageHeader";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteIcon from "@material-ui/icons/Delete";
import { Typography, TextField, Button, IconButton } from "@material-ui/core";
import DropZone from "./Dropzone";
import { newProject, deleteProject } from "../../services/projects";
import Alert from "../../elements/SnackBar";

const useStyles = makeStyles((theme) => ({
  project: {
    width: "300px",
    height: "200px",
  },
  deleteButton: {
    "&:hover": {
      backgroundColor: "#e4ebfd",
      borderColor: "#000",
      color: theme.palette.secondary.main,
    },
  },
  addProject: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "5px dashed #D3D3D3",
    borderRadius: "25px",
    width: "200px",
    height: "120px",
    padding: "40px",
    color: "#D3D3D3",
    "&:hover": {
      backgroundColor: "#e4ebfd",
      borderColor: "#000",
      color: theme.palette.secondary.main,
    },
  },
}));

export default function ProfileProjects({ projects, dispatch }) {
  const classes = useStyles();
  const preventDefault = (event) => event.preventDefault();
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [inHover, setHover] = useState(false);
  const [error, setError] = useState(false);

  const submit = () => {
    if (files.length === 0) {
      setError(true);
    } else if (title === "" || link === "") {
      setError(true);
    } else {
      let image = "";
      if (files.length !== 0) {
        image = files[0].bin;
      }
      console.log("NewProject: ", image);
      newProject(
        {
          title,
          link,
          image,
        },
        dispatch
      );
    }
  };

  const delProject = (projectId) => {
    console.log(projectId);
    deleteProject(projectId, dispatch);
  };

  const editProject = (
    <React.Fragment>
      <Grid item>
        <Box mt={2} mb={1} fontSize="h4.fontSize">
          Add new project here:
        </Box>
      </Grid>
      <Grid item container direction="row" spacing={2}>
        <Grid item xs={6}>
          <DropZone files={files} setFiles={setFiles} />
        </Grid>
        <Grid
          item
          container
          direction="column"
          spacing={1}
          xs={6}
          alignItems="stretch"
          justify="center"
        >
          <Grid item>
            <TextField
              fullWidth
              color="primary"
              defaultValue={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              variant="outlined"
              label="Title"
              xs={6}
              error={error && !title}
              helperText={error && !title ? "Field cannot be blank!" : null}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              color="primary"
              defaultValue={link}
              onChange={(e) => {
                setLink(e.target.value);
              }}
              variant="outlined"
              label="Link"
              xs={6}
              error={error && !link}
              helperText={error && !link ? "Field cannot be blank!" : null}
            />
          </Grid>
        </Grid>
        <Grid item container alignItems="center" justify="center" spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={submit}
            >
              Save project
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setEditMode(false);
              }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <Grid item>
        <Box mb={5}>
          <PageHeader>Projects</PageHeader>
        </Box>
      </Grid>
      <Grid item container direction="row" spacing={5} justify="center">
        {projects.map((item) => {
          return (
            <Grid
              item
              key={item._id}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <Box>
                <img
                  alt="Code"
                  src={item.image}
                  className={classes.project}
                ></img>
              </Box>
              <Grid container direction="row" justify="space-between">
                <Grid item>
                  <Box fontSize="h5.fontSize" textAlign="left">
                    {item.title}
                  </Box>
                  <Box textAlign="left">
                    <Link
                      href="#"
                      onClick={preventDefault}
                      variant="body1"
                      color="inherit"
                    >
                      {item.link}
                    </Link>
                  </Box>
                </Grid>
                <Grid item>
                  {inHover && (
                    <IconButton
                      onClick={() => delProject(item._id)}
                      className={classes.deleteButton}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Grid>
              </Grid>
            </Grid>
          );
        })}
        {!editMode && (
          <Grid item>
            <Box
              className={classes.addProject}
              onClick={() => {
                setEditMode(true);
              }}
            >
              <span>
                <AddCircleIcon style={{ fontSize: 50 }} />
                <Typography variant="h5" display="block">
                  Add new project
                </Typography>
              </span>
            </Box>
          </Grid>
        )}
      </Grid>
      {editMode && editProject}
      <Alert
        open={error && files.length === 0 ? true : false}
        onClick={() => setError(false)}
      >
        Upload image is mandatory
      </Alert>
    </React.Fragment>
  );
}
