import React from "react";
import CodeImg from "./img/code.jpg";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import PageHeader from "../../elements/PageHeader";

const useStyles = makeStyles((theme) => ({
  project: {
    width: "300px",
    height: "200px",
  },
}));

export default function ProfileProjects({ projects }) {
  const classes = useStyles();
  const preventDefault = (event) => event.preventDefault();
  return (
    <React.Fragment>
      <Grid item>
        <Box mt={10} mb={5}>
          <PageHeader>Projects</PageHeader>
        </Box>
      </Grid>
      <Grid item container direction="row" spacing={5} justify="center">
        {projects.map((item) => {
          return (
            <Grid item key={item.title}>
              <Box>
                <img alt="Code" src={CodeImg} className={classes.project}></img>
              </Box>
              <Box fontSize="h6.fontSize" textAlign="left">
                {item.title}
              </Box>
              <Box fontSize="h6.fontSize" textAlign="left">
                <Link
                  href="#"
                  onClick={preventDefault}
                  variant="body2"
                  color="inherit"
                >
                  {item.link}
                </Link>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </React.Fragment>
  );
}
