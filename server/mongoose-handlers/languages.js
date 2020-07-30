const mongoose = require("mongoose");

// Not sure how to implement just yet
const languagesModel = require("../models/languages");

module.exports = {
  createLanguages: async () => {
    const createLanguages = new languagesModel({
      languages: [
        "Python",
        "JavaScript",
        "Java",
        "PHP",
        "GoLang",
        "C#",
        "C++",
        "Ruby",
      ],
    });

    createLanguages.save(function (err) {
      if (err) return console.log(err);
    });
  },
  getLanguages: async () => {
    const languages = await languagesModel.findOne({}, "languages");
    return languages.languages;
  },
};
