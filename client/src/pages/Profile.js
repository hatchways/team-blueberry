import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
//Material-ui imports

import Background from "../elements/Background";
import Navbar from "../components/Navbar";

const Profile = () => {
  return (
    <Background solid>
      <Grid container direction="column">
        <Grid item>
          <Navbar />
        </Grid>
        <Grid item container>
          <Typography component="h1" variant="h6">
            Profile
          </Typography>
        </Grid>
      </Grid>
    </Background>
  );
};

export default Profile;
