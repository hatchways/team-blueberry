//Request handler import
const request = require("../utils/requestHandlers");

const getReviews = async (dispatch) => {
  dispatch({ type: "GET_USER_REVIEWS" });

  //Make get call to api for retrieving reviews on current user, make sure to remove and fix user in body
  const config = {
    method: "post",
    url: "/api/user/reviews",
  };

  const response = await request.postToAPI(config);
  if (response.status != 201) {
    dispatch({ type: "GET_USER_REVIEWS_ERROR" });
    return { status: response.status };
  }

  dispatch({ type: "GET_USER_REVIEWS_SUCCESS" });
  return response.data;
};

const getReview = async (reviewId, dispatch) => {
  dispatch({ type: "GET_USER_REVIEW" });

  //Make get call to api for retrieving reviews on current user
  const config = {
    method: "post",
    url: "/api/user/reviews",
    data: {
      singleTarget: true,
      reviewId: reviewId,
    },
  };

  const response = await request.postToAPI(config);
  if (response.status != 201) {
    dispatch({ type: "GET_USER_REVIEW_ERROR" });
    return { status: response.status };
  }

  dispatch({ type: "GET_USER_REVIEW_SUCCESS" });

  const result = response.data;
  return result;
};

module.exports = { getReviews, getReview };
