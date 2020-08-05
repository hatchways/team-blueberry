//Import Prism language grammar
import go from "prismjs/components/prism-go";
import clike from "prismjs/components/prism-clike";
import ruby from "prismjs/components/prism-ruby";
import php from "prismjs/components/prism-php";
import python from "prismjs/components/prism-python";
import c from "prismjs/components/prism-c";
import cpp from "prismjs/components/prism-cpp";
import csharp from "prismjs/components/prism-csharp";
import java from "prismjs/components/prism-java";

const languagesGrammar = {
  Python: "python",
  JavaScript: "javascript",
  Java: "java",
  PHP: "php",
  GoLang: "go",
  "C#": "csharp",
  "C++": "cpp",
  Ruby: "ruby",
};

export { go, clike, ruby, php, python, c, cpp, csharp, java, languagesGrammar };
