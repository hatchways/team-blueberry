//Request handler import
const request = require("../utils/requestHandlers");

module.exports = {
  async getLanguages() {
    //Make get call to API for languages
    const config = {
      method: "get",
      url: "/api/languages",
    };

    const data = await request.getFromAPI();
    // return { languages: ["Javascript"] };

    if (!data) {
      return "Request Failed";
    }

    return data.data;
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

    const response = await request.putToAPI(config);

    if (typeof response.status != "undefined") {
      console.log(response.status);
    }

    if (!response) {
      return "Request Failed";
    }

    //Returned response.status should be 201 success
    return response;
    // return { message: "success" };
  },
};
