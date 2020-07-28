//Request handler import
const request = require("../utils/requestHandlers");

const getLanguages = async (dispatch) => {
  dispatch({ type: "GET_LANGUAGES" });
  //Make get call to API for languages
  const config = {
    method: "get",
    url: "/api/languages",
  };

  const data = await request.getFromAPI();
  // return { languages: ["Javascript"] };

  if (!data) {
    dispatch({ type: "GET_LANGUAGES_ERROR" });
    return "Request Failed";
  }

  dispatch({ type: "GET_LANGUAGES_SUCCESS" }, { languages: data.data });
  return data.data;
};

const updateLanguages = async (dispatch, languages) => {
  console.log("dispatch", dispatch);
  dispatch({ type: "UPDATE_USER_LANGUAGES" });

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
    dispatch({ type: "UPDATE_USER_LANGUAGES_ERROR" });
    return "Request Failed";
  }

  dispatch({ type: "UPDATE_USER_LANGUAGES_SUCCESS" });
};

export { getLanguages, updateLanguages };
