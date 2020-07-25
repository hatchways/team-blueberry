//Languages services import
const languages = require("../services/languages");

//Handle Onboarding API logic
module.exports = {
  async getLanguages() {
    //Returns languages list
    return await languages.getLanguages();
  },
  async updateLanguages(languages) {
    //Returns success or fail
    return await languages.updateLanguages(languages);
  },
};
