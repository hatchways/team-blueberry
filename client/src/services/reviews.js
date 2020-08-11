//Request handler import
const request = require("../utils/requestHandlers");

const getReviews = async (dispatch) => {
  dispatch({ type: "FETCH" });

  //Make get call to api for retrieving reviews on current user, make sure to remove and fix user in body
  const config = {
    method: "get",
    url: "/api/user/reviews",
  };
  try {
    const { data } = await request.postToAPI(config);
    dispatch({
      type: "GET_USER_REVIEWS_SUCCESS",
      reviews: data.reviews,
    });
  } catch (e) {
    dispatch({
      type: "GET_USER_REVIEWS_ERROR",
      error: { ...e },
    });
  }
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
