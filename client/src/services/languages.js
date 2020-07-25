//Request handler import
const request = require("../utils/requestHandlers");

module.exports = {
  async getLanguages() {
    //Make get call to API for languages
    return { languages: ["Javascript"] };
  },
  async updateLanguages(languages) {
    //Make put call to api for updating languages on current user
    return { message: "success" };
  },
};
