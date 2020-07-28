const languagesService = (body) => async (dispatch) => {
  // set loading state
  dispatch({ type: "FETCH_USER" });

  try {
    const result = await fetch(
      "/api/user/me"
      // if options are needed
    )
      .then((res) => res.text())
      .then((res) => JSON.parse(res));
    // throw if server returns an error message
    if (result.error) throw result.error;

    dispatch({ type: "FETCH_USER_SUCCESS", user: result.user });
  } catch (e) {
    dispatch({ type: "FETCH_USER_ERROR", error: { ...e } });
  }
  // on exception
};

const request = require("../utils/requestHandlers");

const getLanguages = (body) => async (dispatch) => {
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
};

const updateLanguages = (body) => async (dispatch) =>{
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

export { getLanguages, updateLanguages };
