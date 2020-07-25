//Languages services import
const languages = require("../services/languages");

//Handle Onboarding API logic
module.exports = {
  async getLanguages() {
    //Returns languages list
    const data = await languages.getLanguages();
    return data;
  },
  async updateLanguages(skillList) {
    //Returns success or fail
    const data = await languages.updateLanguages(skillList);
    return data;
  },
};
