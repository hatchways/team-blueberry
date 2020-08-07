import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
//Material-ui imports

import Background from "../elements/Background";

const Profile = ({ state, dispatch }) => {
  return (
    <Background solid>
      <Grid container direction="column">
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
