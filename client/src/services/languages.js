//Request handler import
const request = require("../utils/requestHandlers");

module.exports = {
  async getLanguages() {
    //Make get call to API for languages
    const config = {
      method: "get",
      url: "/api/languages",
    };

    const data = await request.getFromApi().data;
    // return { languages: ["Javascript"] };
  },
  async updateLanguages(languages) {
    //Make put call to api for updating languages on current user
    const config = {
      method: "put",

      //This may need to be changed to a relevant route, but since it is updating user I believe it should be here
      url: "/api/user/languages",
      data: {
        languages,
      },
    };

    const data = await request.putToAPI(config).data;
    return data;
    // return { message: "success" };
  },
};
