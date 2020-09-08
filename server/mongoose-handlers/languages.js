const languagesModel = require("../models/languages");

module.exports = {
  getLanguages: async () => {
    const languages = await languagesModel.findOne({}, "languages");
    return languages.languages;
  },
};
