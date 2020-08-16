//Request handler import
const request = require("../utils/requestHandlers");

const getLanguages = async (dispatch) => {
  dispatch({ type: "GET_LANGUAGES" });
  //Make get call to API for languages
  const config = {
    method: "get",
    url: "/api/languages",
  };

  const data = await request.getFromAPI(config);
  if (!data) {
    dispatch({ type: "GET_LANGUAGES_ERROR" });
    return "Request Failed";
  }

  dispatch({ type: "GET_LANGUAGES_SUCCESS" }, { languages: data.data });
  const result = data.data;
  return result;
};

const updateLanguages = async (languages, dispatch) => {
  dispatch({ type: "UPDATE_USER_LANGUAGES" });

  //Make put call to api for updating languages on current user
  try {
    const config = {
      method: "put",
      url: "/api/user/languages",
      data: {
        languages,
      },
    };

    const response = await request.putToAPI(config);
    dispatch({
      type: "UPDATE_USER_LANGUAGES_SUCCESS",
      user: response.data.toObject(),
    });
  } catch (e) {
    dispatch({ type: "UPDATE_USER_LANGUAGES_ERROR", error: { ...e } });
  }
};

export { getLanguages, updateLanguages };
