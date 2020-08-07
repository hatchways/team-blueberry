import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import PageHeader from "../../elements/PageHeader";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import DropZone from "./Dropzone";

export default function ProfileName({
  edit,
  name,
  about,
  editName,
  editAbout,
  files,
  setFiles,
}) {
  if (edit) {
    return (
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
          />
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            color="primary"
            defaultValue={about}
            onChange={editAbout}
            variant="outlined"
            label="About"
            xs={6}
          />
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid item>
        <Box mt={7}>
          <PageHeader>{name}</PageHeader>
          <Typography variant="subtitle1">{about}</Typography>
        </Box>
      </Grid>
    );
  }
}
