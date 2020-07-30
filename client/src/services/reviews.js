//Request handler import
const request = require("../utils/requestHandlers");

const getReviews = async (dispatch) => {
  dispatch({ type: "GET_USER_REVIEWS" });

  //Make get call to api for retrieving reviews on current user
  const config = {
    method: "get",
    url: "/api/user/reviews",
  };

  const response = await request.getFromAPI(config);

  if (typeof response.status != "undefined") {
    console.log(response.status);
  }

  if (!response) {
    dispatch({ type: "GET_USER_REVIEWS_ERROR" });
    return "Request Failed";
  }

  dispatch({ type: "GET_USER_REVIEWS_SUCCESS" });
};

module.exports = { getReviews };
