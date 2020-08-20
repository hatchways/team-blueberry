//Request handler import
const request = require("../utils/requestHandlers");

const getReviews = async (dispatch) => {
  dispatch({ type: "FETCH_REVIEWS" });
  //Make get call to api for retrieving reviews on current user, make sure to remove and fix user in body
  const config = {
    method: "post",
    url: "/api/user/reviews",
  };
  try {
    const { data } = await request.postToAPI(config);
    dispatch({
      type: "FETCH_REVIEWS_SUCCESS",
      reviews: data.reviews,
    });
  } catch (e) {
    dispatch({
      type: "FETCH_REVIEWS_ERROR",
      error: e.message,
    });
  }
};

const getReview = async (reviewId, dispatch) => {
  dispatch({ type: "FETCH_REQUEST" });

  //Make get call to api for retrieving reviews on current user
  const config = {
    method: "post",
    url: "/api/user/reviews",
    data: {
      singleTarget: true,
      reviewId: reviewId,
    },
  };
  try {
    const { data } = await request.postToAPI(config);
    dispatch({
      type: "FETCH_REQUEST_SUCCESS",
      status: data.request.status,
      review: data.request.embeddedReview,
      requestId: data.request._id,
      selectedReviewer: data.reviewer,
      userOwner: data.request.userOwner,
    });
  } catch (e) {
    dispatch({
      type: "FETCH_REQUEST_ERROR",
      error: e.message,
    });
  }
};

module.exports = { getReviews, getReview };
