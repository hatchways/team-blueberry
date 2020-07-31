import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  controls: {
    borderBottom: "1px solid #ddd",
  },
}));

export default function Toolbar({ editorState, RichUtils, setEditorState }) {
  const classes = useStyles();

  const ToolButton = ({ format, icon }) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    return (
      <IconButton
        size="medium"
        color={currentStyle.has(format) ? "secondary" : "default"}
        onMouseDown={(event) => {
          event.preventDefault();
          let nextState = RichUtils.toggleInlineStyle(editorState, format);
          setEditorState(nextState);
        }}
      >
        <Icon>{icon}</Icon>
      </IconButton>
    );
  };

  const BlockButton = ({ format, icon }) => {
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();
    return (
      <IconButton
        size="medium"
        color={format === blockType ? "secondary" : "default"}
        onMouseDown={(event) => {
          event.preventDefault();
          let nextState = RichUtils.toggleBlockType(editorState, format);
          setEditorState(nextState);
        }}
      >
        <Icon>{icon}</Icon>
      </IconButton>
    );
  };

  return (
    <div className={classes.controls}>
      <Grid container justify="flex-start">
        <Grid item xs={8} sm="auto" md="auto">
          <ToolButton format="BOLD" icon="format_bold" />
          <ToolButton format="ITALIC" icon="format_italic" />
          <ToolButton format="UNDERLINE" icon="format_underlined" />
          <BlockButton format="code-block" icon="code" />
        </Grid>
        <Grid item xs sm={5} md>
          <Box display={{ xs: "none", sm: "block" }}>
            <BlockButton format="blockquote" icon="format_quote" />
            <BlockButton
              format="ordered-list-item"
              icon="format_list_numbered"
            />
            <BlockButton
              format="unordered-list-item"
              icon="format_list_bulleted"
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
