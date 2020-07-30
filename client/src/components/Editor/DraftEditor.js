import React, { useState, useEffect, useRef } from "react";
// Draftjs editor imports
import Draft, { Editor, EditorState, RichUtils, convertToRaw } from "draft-js";
import CodeUtils from "draft-js-code";
import PrismDecorator from "draft-js-prism";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "./css/draft.css";
// Material-UI imports
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
// Prism language support:
import {
  go,
  clike,
  ruby,
  php,
  python,
  c,
  cpp,
  csharp,
  java,
  languagesGrammar,
} from "./languages";

const useStyles = makeStyles((theme) => ({
  editor: {
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  controls: {
    borderBottom: "1px solid #ddd",
  },
}));

const MyEditor = ({ language, makeSubmit, onSubmit, hasContent }) => {
  const classes = useStyles();

  let mappedLanguage;
  if (language === "") {
    mappedLanguage = null;
  } else {
    mappedLanguage = languagesGrammar[language];
  }

  const decorator = new PrismDecorator({
    prism: Prism,
    defaultSyntax: mappedLanguage,
  });

  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(decorator)
  );
  //Amending code blocks for Prism
  const getBlockStyle = (block) => {
    switch (block.getType()) {
      case "code-block":
        return "language-".concat(mappedLanguage);
      default:
        return null;
    }
  };

  // Rerender Draftjs every time we change language
  useEffect(() => {
    const selection = editorState.getSelection();
    const block = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey());
    const data = block.getData().merge({ syntax: mappedLanguage });
    const newBlock = block.merge({ data });
    const newContentState = editorState.getCurrentContent().merge({
      blockMap: editorState
        .getCurrentContent()
        .getBlockMap()
        .set(selection.getStartKey(), newBlock),
      selectionAfter: selection,
    });
    setEditorState(
      EditorState.push(editorState, newContentState, "change-block-data")
    );
  }, [editorState, mappedLanguage]);

  // Focus editor (we will chat using the same editor, right?)
  const editor = useRef(null);
  const focusEditor = () => {
    editor.current.focus();
  };
  useEffect(() => {
    focusEditor();
  }, []);

  //Change handler
  const onChange = (newEditorState) => {
    if (newEditorState.getCurrentContent().hasText()) {
      hasContent(true);
    } else {
      hasContent(false);
    }
    setEditorState(EditorState.set(newEditorState, { decorator }));
  };

  // DraftJs code utils for easier code editing:
  const handleKeyCommand = (command) => {
    let newState;

    if (CodeUtils.hasSelectionInBlock(editorState)) {
      newState = CodeUtils.handleKeyCommand(editorState, command);
    }

    if (!newState) {
      newState = RichUtils.handleKeyCommand(editorState, command);
    }

    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const keyBindingFn = (evt) => {
    if (!CodeUtils.hasSelectionInBlock(editorState))
      return Draft.getDefaultKeyBinding(evt);

    const command = CodeUtils.getKeyBinding(evt);

    return command || Draft.getDefaultKeyBinding(evt);
  };

  const handleReturn = (evt) => {
    if (!CodeUtils.hasSelectionInBlock(editorState)) return "not-handled";

    setEditorState(CodeUtils.handleReturn(evt, editorState));
    return "handled";
  };

  const onTab = (evt) => {
    if (!CodeUtils.hasSelectionInBlock(editorState)) return "not-handled";

    setEditorState(CodeUtils.onTab(evt, editorState));
    return "handled";
  };

  //Transfer text to make request
  useEffect(() => {
    if (makeSubmit) {
      const rawText = convertToRaw(editorState.getCurrentContent());

      onSubmit({ text: rawText });
      setEditorState(EditorState.createEmpty(decorator));
    }
  }, [makeSubmit]);

  // Rendering control buttons
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
    <div className={classes.editor}>
      <div className={classes.controls}>
        <Grid container justify="flex-start">
          <Grid item xs={8} sm="auto" md="auto">
            <ToolButton format="BOLD" icon="format_bold" />
            <ToolButton format="ITALIC" icon="format_italic" />
            <ToolButton format="UNDERLINE" icon="format_underlined" />
            <BlockButton format="code-block" icon="code" />
          </Grid>
          <Grid item xs={0} sm={5} md>
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
      <Editor
        editorState={editorState}
        onChange={onChange}
        keyBindingFn={keyBindingFn}
        handleKeyCommand={handleKeyCommand}
        handleReturn={handleReturn}
        blockStyleFn={getBlockStyle}
        onTab={onTab}
        ref={editor}
      />
    </div>
  );
};

export default MyEditor;
