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
  position,
  company,
  editName,
  editPosition,
  editCompany,
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
    );
  } else {
    return (
      <Grid item>
        <Box mt={7}>
          <PageHeader>{name}</PageHeader>
          <Typography variant="subtitle1">
            {position && company
              ? `${position} at ${company}`
              : position
              ? `${position}`
              : company
              ? `Works at ${company}`
              : null}
          </Typography>
        </Box>
      </Grid>
    );
  }
}
