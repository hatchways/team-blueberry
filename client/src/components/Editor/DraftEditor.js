import React, { useState, useEffect } from "react";
// Draftjs editor imports
import Draft, {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
  getDefaultKeyBinding,
} from "draft-js";
import CodeUtils from "draft-js-code";
import PrismDecorator from "draft-js-prism";
import Prism from "prismjs";
import "prismjs/themes/prism-okaidia.css";
import "./css/draft.css";
// Material-UI imports
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "./Toolbar";

// Prism language support:
import { languagesGrammar } from "./languages";

const useStyles = makeStyles((theme) => ({
  editor: {
    border: "1px solid #ddd",
    borderRadius: "4px",
    minHeight: "320px",
  },
  controls: {
    borderBottom: "1px solid #ddd",
  },
}));

const MyEditor = ({
  language,
  makeSubmit,
  onSubmit,
  hasContent,
  content,
  readOnly,
}) => {
  const classes = useStyles();

  const mappedLanguage = languagesGrammar[language] || null;

  const decorator = new PrismDecorator({
    prism: Prism,
    defaultSyntax: mappedLanguage,
  });

  const createInitialState = (content) => {
    if (content) {
      const currentContent = convertFromRaw(content);
      return EditorState.createWithContent(currentContent, decorator);
    }
    return EditorState.createEmpty(decorator);
  };

  const [editorState, setEditorState] = useState(createInitialState(content));

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

  const onKeyPressed = (event) => {
    if (event.key === "Tab") {
      setEditorState(CodeUtils.onTab(event, editorState));
      event.preventDefault();
      return "myeditor-save";
    }
    return getDefaultKeyBinding(event);
  };

  useEffect(() => {
    if (makeSubmit) {
      const rawText = convertToRaw(editorState.getCurrentContent());

      onSubmit({ text: rawText });
      setEditorState(EditorState.createEmpty(decorator));
    }
  }, [decorator, onSubmit, editorState, makeSubmit]);

  return (
    <div className={!readOnly ? classes.editor : "false"}>
      {!readOnly && (
        <Toolbar
          editorState={editorState}
          RichUtils={RichUtils}
          setEditorState={setEditorState}
        />
      )}
      <div onKeyDown={onKeyPressed}>
        <Editor
          editorState={editorState}
          onChange={onChange}
          keyBindingFn={keyBindingFn}
          handleKeyCommand={handleKeyCommand}
          handleReturn={handleReturn}
          blockStyleFn={getBlockStyle}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
};

export default MyEditor;
