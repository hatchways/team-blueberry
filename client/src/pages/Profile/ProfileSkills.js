import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import PythonImg from "./img/python.png";
import JsImg from "./img/js.png";
import CppImg from "./img/cpp.png";
import RubyImg from "./img/ruby.png";
import JavaImg from "./img/java.png";
import PhpImg from "./img/php.png";
import GoImg from "./img/go.png";
import CsharpImg from "./img/csharp.png";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  logo: {
    width: "100px",
    height: "100px",
  },
}));

export default function ProfileSkills({ skills }) {
  const classes = useStyles();
  const getImg = (lang) => {
    switch (lang) {
      case "JavaScript":
        return JsImg;
      case "Java":
        return JavaImg;
      case "PHP":
        return PhpImg;
      case "C++":
        return CppImg;
      case "Python":
        return PythonImg;
      case "Ruby":
        return RubyImg;
      case "GoLang":
        return GoImg;
      case "C#":
        return CsharpImg;
      default:
        return "No image";
    }
  };
  return (
    <Grid item container direction="row" justify="space-evenly" spacing={5}>
      {skills.map((item) => {
        return (
          <Grid item key={item.language}>
            <Box>
              <img
                key={item.language}
                alt={item.language}
                src={getImg(item.language)}
                className={classes.logo}
              ></img>
            </Box>
            <Box fontSize="h6.fontSize" textAlign="center">
              {item.level}
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
}
