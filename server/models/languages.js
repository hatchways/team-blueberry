const mongoose = require("mongoose");

// Possibly incorrect usage of enum here
const languagesSchema = new mongoose.Schema({
  languages: [
    {
      enum: [
        "Python",
        "JavaScript",
        "Java",
        "PHP",
        "GoLang",
        "C#",
        "C++",
        "Ruby",
      ],
      type: String,
    },
  ],
});

module.exports = mongoose.model(
  "LanguageSchema",
  languagesSchema,
  "languagesCollection"
);
