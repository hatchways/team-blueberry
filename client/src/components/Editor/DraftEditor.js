import React, { useState, useEffect } from "react";
// Draftjs editor imports
import Draft, { Editor, EditorState, RichUtils } from "draft-js";
import CodeUtils from "draft-js-code";
import PrismDecorator from "draft-js-prism";
import Prism from "prismjs";
import Immutable from "immutable";
import "prismjs/themes/prism-okaidia.css";
import "./css/draft.css";
//Material-UI imports
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
// import loadLanguages from "prismjs/components/index";
// loadLanguages(["java"]);

const languagesSyntax = {
  Python: "python",
  JavaScript: "javascript",
  Java: "java",
  PHP: "php",
  GoLang: "go",
  "C#": "csharp",
  "C++": "cpp",
  Ruby: "ruby",
};

const useStyles = makeStyles((theme) => ({
  editor: {
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  controls: {
    borderBottom: "1px solid #ddd",
  },
}));

const MyEditor = (props) => {
  const classes = useStyles();

  let mappedLanguage;
  if (props.language === "") {
    mappedLanguage = null;
  } else {
    mappedLanguage = languagesSyntax[props.language];
    console.log(mappedLanguage);
  }
  console.log(Prism.languages);

  const decorator = new PrismDecorator({
    prism: Prism,
    defaultSyntax: mappedLanguage,
  });

  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(decorator)
  );

  const getBlockStyle = (block) => {
    switch (block.getType()) {
      case "code-block":
        return "language-".concat(mappedLanguage);
      default:
        return null;
    }
  };

  // Rerender Draftjs everytime it changes applying prismjs
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
  });

  const handleChange = (newEditorState) => {
    const prevContentState = editorState.getCurrentContent();
    const currentContentState = newEditorState.getCurrentContent();

    if (!prevContentState.hasText()) {
      setEditorState(EditorState.set(newEditorState, { decorator }));
      return;
    } else {
      setEditorState(EditorState.set(newEditorState, { decorator }));
    }
  };

  // DraftJs code utils:
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
        <ToolButton format="BOLD" icon="format_bold" />
        <ToolButton format="ITALIC" icon="format_italic" />
        <ToolButton format="UNDERLINE" icon="format_underlined" />
        <BlockButton format="code-block" icon="code" />
        <BlockButton format="blockquote" icon="format_quote" />
        <BlockButton format="ordered-list-item" icon="format_list_numbered" />
        <BlockButton format="unordered-list-item" icon="format_list_bulleted" />
      </div>
      <Editor
        editorState={editorState}
        onChange={handleChange}
        keyBindingFn={keyBindingFn}
        handleKeyCommand={handleKeyCommand}
        handleReturn={handleReturn}
        blockStyleFn={getBlockStyle}
        onTab={onTab}
      />
    </div>
  );
};

export default MyEditor;
