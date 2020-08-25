import axios from "axios";

export const sendMessage = async (reviewId, message, dispatch) => {
  // dispatch({ type: "SEND_MESSAGE" });
  try {
    const res = await axios({
      method: "POST",
      data: {
        reviewId,
        message: JSON.stringify(message),
      },
      withCredentials: true,
      url: "/api/user/request/message",
    });
    dispatch({
      type: "SEND_MESSAGE_SUCCESS",
      review: res.data.embeddedReview,
      requestId: res.data.requestId,
    });
  } catch (error) {
    dispatch({
      type: "SEND_MESSAGE_ERROR",
      error: error.message,
    });
  }
};
