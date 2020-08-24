import axios from "axios";

export const sendRequest = async (isAccepted, requestId, dispatch) => {
  try {
    dispatch({ type: "STATUS_SENT" });
    const { data } = await axios({
      method: "POST",
      data: {
        isAccepted,
        requestId,
      },
      withCredentials: true,
      url: "/api/user/request",
    });
    if (isAccepted)
      dispatch({
        type: "STATUS_ACCEPTED",
        status: "accepted",
        selectedReviewer: data,
      });
    else
      dispatch({
        type: "STATUS_DECLINED",
        status: "declined",
        selectedReviewerId: null,
      });
  } catch (error) {
    dispatch({ type: "STATUS_ERROR", error: error.message });
  }
};
